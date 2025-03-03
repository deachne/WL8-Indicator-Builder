# Setting Up Anthropic API Key for Claude Models

To use Claude models in the WL8 Indicator Builder, you'll need to obtain an API key from Anthropic. Follow these steps to get your API key and set it up in the project:

## 1. Create an Anthropic Account

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up for an account if you don't already have one
3. Complete the verification process

## 2. Get Your API Key

1. Once logged in, navigate to the API Keys section in your account
2. Click "Create API Key"
3. Give your key a name (e.g., "WL8 Indicator Builder")
4. Copy the API key that is generated (it starts with `sk-ant-...`)

## 3. Add Your API Key to the Project

1. Open the `.env` file in the root of the project
2. Find the `ANTHROPIC_API_KEY=` line
3. Add your API key after the equals sign, with no spaces:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
4. Save the file

## 4. Restart Your Development Server

If your development server is running, restart it to load the new environment variable:

```bash
npm run dev
```

## 5. Test the Integration

Try asking a question that would benefit from Claude's reasoning capabilities, such as:
- "Can you explain how the RSI indicator works?"
- "What's the difference between SMA and EMA?"

## Pricing Information

Anthropic's Claude API is a paid service with the following pricing tiers (as of March 2025):

- **Claude 3.5 Sonnet**: $3.00 per million input tokens, $15.00 per million output tokens
- **Claude 3 Opus**: $15.00 per million input tokens, $75.00 per million output tokens
- **Claude 3 Sonnet**: $3.00 per million input tokens, $15.00 per million output tokens
- **Claude 3 Haiku**: $0.25 per million input tokens, $1.25 per million output tokens

The WL8 Indicator Builder uses Claude 3.5 Sonnet for code generation tasks and Claude 3 Sonnet/Opus for conceptual questions, offering an optimal balance of performance and cost.

## Troubleshooting

If you encounter errors related to the Anthropic API:

1. Verify your API key is correctly entered in the `.env` file
2. Check that your Anthropic account has billing information set up
3. Ensure your API key has not reached its rate limits
4. Check the console logs for specific error messages

For more information, visit [Anthropic's API documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api).
