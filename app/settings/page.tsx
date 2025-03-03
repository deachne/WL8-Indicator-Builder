import { Metadata } from "next";
import { ApiKeysForm } from "@/components/api-keys-form";

export const metadata: Metadata = {
  title: "API Keys Settings | WL8 Indicator Builder",
  description: "Configure your API keys for OpenAI and Anthropic to use the AI assistant.",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Keys Settings</h1>
          <p className="text-muted-foreground">
            Configure your API keys to use the AI assistant. Your keys are stored locally in your browser and are not sent to our servers.
          </p>
        </div>
        
        <ApiKeysForm />
        
        <div className="mt-10 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About API Keys</h2>
          <p className="mb-4">
            The WL8 Indicator Builder uses AI models from Anthropic and OpenAI to provide assistance with indicator development.
            To use these features, you need to provide your own API keys.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Why do I need to provide API keys?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cost control:</strong> By using your own API keys, you have full control over your usage and costs.
            </li>
            <li>
              <strong>Security:</strong> Your API keys are stored locally in your browser's localStorage and are never sent to our servers.
            </li>
            <li>
              <strong>Customization:</strong> You can choose which AI provider to use based on your preferences.
            </li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Recommended Setup</h3>
          <p className="mb-2">
            For the best experience, we recommend setting up both Anthropic and OpenAI API keys:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Anthropic Claude 3.5 Sonnet:</strong> Used for code generation tasks, providing high-quality C# code for WL8 indicators.
            </li>
            <li>
              <strong>Anthropic Claude 3 Sonnet/Opus:</strong> Used for conceptual questions and explanations about trading indicators.
            </li>
            <li>
              <strong>OpenAI GPT-4o:</strong> Used as a fallback if Anthropic API is unavailable.
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-950 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-blue-200">Getting Started</h3>
            <ol className="list-decimal pl-6 space-y-2 text-blue-100">
              <li>Sign up for accounts at <a href="https://console.anthropic.com/" target="_blank" className="text-blue-300 hover:underline">Anthropic</a> and <a href="https://platform.openai.com/" target="_blank" className="text-blue-300 hover:underline">OpenAI</a>.</li>
              <li>Generate API keys from each provider's dashboard.</li>
              <li>Enter your API keys in the form above and click "Save & Test Keys".</li>
              <li>Once your keys are verified, you can start using the AI assistant in the Builder and Q&A sections.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
