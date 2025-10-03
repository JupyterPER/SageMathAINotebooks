# Bulit-in AI Assistant

To use the built-in AI assistant, follow these steps:

1. **Log in** to your chosen AI provider's website
2. **Generate an API key** using the "Where to obtain API key" URL provided for each provider below
3. **Copy the API key** and paste it into the AI Settings
4. **Select the provider** from the dropdown (the API URL will load automatically)
5. **Enter the model name** you want to use (copy from the examples below)
6. **Specify the language** for AI responses (e.g., English, Spanish, French, etc., English by default)
7. **Save your changes**

After saving your settings, three AI assistant buttons will appear next to your code cells:

- **AI Generate**: Create code based on your description or requirements
- **AI Format**: Automatically format and clean up your code structure
- **AI Explain**: Get a detailed explanation of what the code does

> **Note**: The AI will respond in your specified language for all interactions.

## OpenAI (paid)

API URL: https://api.openai.com/v1/chat/completions

Where to obtain API key: https://platform.openai.com/api-keys

Available are for example:

```
gpt-5
```
```
gpt-5-mini
```
```
gpt-5-nano
```

List of models: https://platform.openai.com/docs/models

## Mistral (free)

API URL: https://api.mistral.ai/v1/chat/completions

Where to obtain API key: https://console.mistral.ai/api-keys

Available are for example:

```
mistral-small-latest
```
```
mistral-medium-latest
```
```
mistral-large-latest
```
```
codestral-latest
```

List of models: https://docs.mistral.ai/getting-started/models/models_overview

<!--
## Anthropic (not tested)

API URL: https://api.anthropic.com/v1/chat/completions

Where to obtain API key: https://console.anthropic.com/settings/keys

Available is for example:
```python
claude-sonnet-4-20250514
```

List of models: https://anthropic.mintlify.app/en/api/models-list
-->

## Poe (both free and paid plan)

API URL: https://api.poe.com/v1/chat/completions

Where to obtain API key: https://poe.com/api_key

Available are for example:

```
Assistant
```
```
GPT-5-mini
```
```
Claude-Haiku-3
```

List of models: https://poe.com/explore

> Depending on your subscription tier, you may choose from premiere tier models, such as GPT-5-Chat or Claude-Sonnet-4.5.

## OpenRouter (free and paid options)

API URL: https://openrouter.ai/api/v1/chat/completions

Where to obtain API key: https://openrouter.ai/settings/keys

```
openai/gpt-oss-120b:free
```
```
qwen/qwen3-coder:free
```
```
x-ai/grok-4-fast:free
```

List of models: [https://openrouter.ai/models?order=pricing-low-to-high](https://openrouter.ai/models?order=pricing-low-to-high) 

> OpenRouter offers both free API access or paid under “pay-as-you-go” subscription offering nearly all mainstream models.

## Groq (free)

API URL:  https://api.groq.com/openai/v1/chat/completions

Where to obtain API key: https://console.groq.com/keys

Available are for example:

```
openai/gpt-oss-120b
```
```
openai/gpt-oss-20b
```

List of models: https://console.groq.com/docs/models

> Groq provides open source models, which may have limited capabilites.

## Cerebras

API URL: https://api.cerebras.ai/v1/chat/completions

Where to obtain API key: https://cloud.cerebras.ai/platform/ (API keys option in Menu)

Available are for example:

```python
gpt-oss-120b
```
```python
llama-4-maverick-17b-128e-instruct
```

List of models: https://inference-docs.cerebras.ai/models/overview

## Github

API URL: https://models.github.ai/inference/chat/completions

Where to obtain API key: https://github.com/settings/tokens

Available are for example:

```
meta/Llama-4-Scout-17B-16E-Instruct
```

```
mistral-ai/Mistral-Large-2411
```

List of models: https://github.com/marketplace/models 

> Click *”Model: Select a Model”* which provides a list of models. After choosing one click *”Use Model”* and look for `model` to obtain its name in provided code snippets.

## DeepSeek (paid)

API URL: https://api.deepseek.com/v1/chat/completions

Where to obtain API key: https://platform.deepseek.com/api_keys

```
deepseek-chat
```

List of models: https://api-docs.deepseek.com/quick_start/pricing

<!--
Disclaimer
If you are using some of the thinking model, in your response may appear parts related to the CoT of the given model. Make sure to delete them, especially in code cells.
-->
