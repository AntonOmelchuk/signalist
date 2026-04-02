import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendWelcomeEmail } from "../nodemailer";
import inngest from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email", triggers: { event: "app/user.created" } },
  async ({ event, step }) => {
    const {
      data: { country, investmentGoals, riskTolerance, preferredIndustry },
    } = event;
    const userProfile = `
      - Country: ${country}
      - Investment goals: ${investmentGoals}
      - Risk tolerance: ${riskTolerance}
      - Preferred industry: ${preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";

      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  },
  async ({ step }) => {
    // Step#1 Get all users for news delivery
    const users: User[] = await step.run(
      "get-all-users",
      getAllUsersForNewsEmail,
    );

    if (!users || users.length === 0)
      return { success: false, message: "No users found for news email" };

    // Step#2 Fetch personalized news for each user
    const results = await step.run("fetch-user-news", async () => {
      const perUser: Array<{
        user: User;
        articles: MarketNewsArticle[];
      }> = [];

      for (const user of users) {
        try {
          const { email } = user;
          const symbols = await getWatchlistSymbolsByEmail(email);
          let articles = await getNews(symbols);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still emppty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }

          perUser.push({ user, articles });
        } catch (error) {
          console.error("daily-news: error preparing user news", error);
          perUser.push({ user, articles: [] });
        }
      }

      return perUser;
    });

    // Step#3 Summarize news via AI
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

    for (const { user, articles } of results) {
      const { email } = user;

      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2),
        );

        const response = await step.ai.infer(`summarize-news-${email}`, {
          model: step.ai.models.gemini({ model: "gemini-2.5-flash-light" }),
          body: {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) || "No market news.";

        userNewsSummaries.push({ user, newsContent });
      } catch (error) {
        console.error(`Failed to summarize news for: ${email}`, error);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }
  },
);
