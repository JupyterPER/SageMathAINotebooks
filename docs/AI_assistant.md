# Bulid in AI Assistant

AI assistant is revealed once the AI API provider is selected and API key is provided.

You need to log in on a webpage of provider of your choice. After log in you may be able to generate API key under “Where to obtain API key” URLs, copy it and paste it in AI Setting. Choose propper provider (API URL will load automatically) and also copy and paste proper model of your choice. After saving the changes, set of 3 new buttons will appear near code cells.

## OpenAI (paid)

API url: https://api.openai.com/v1/chat/completions
Where to obtain API key: https://platform.openai.com/api-keys

Available are for example:

```python
gpt-5
```
```python
gpt-5-mini
```
```python
gpt-5-nano
```

List of models: https://platform.openai.com/docs/models

## Mistral (free)

API url: https://api.mistral.ai/v1/chat/completions
Where to obtain API key: https://console.mistral.ai/api-keys

Available are for example:

```python
mistral-small-latest
```
```python
mistral-medium-latest
```
```python
mistral-large-latest
```
```python
codestral-latest
```
List of models: https://docs.mistral.ai/getting-started/models/models_overview

<!--
## Anthropic (not tested)

API url: https://api.anthropic.com/v1/chat/completions

Where to obtain API key: https://console.anthropic.com/settings/keys

Available is for example:
```python
claude-sonnet-4-20250514
```

List of models: https://anthropic.mintlify.app/en/api/models-list
-->

## Poe (both free and paid plan)

API url: https://api.poe.com/v1/chat/completions

Where to obtain API key: https://poe.com/api_key

Available are for example:

```python 
Assistant
```
```python
GPT-5-mini
```
```python
Claude-Haiku-3
```

List of models: https://poe.com/explore

> Depending on your subscription tier, you may choose from premiere tier models. With free tier you can use Assistant.

## OpenRouter (free and paid options)

API url: https://openrouter.ai/api/v1/chat/completions

Where to obtain API key: https://openrouter.ai/settings/keys

```python
openai/gpt-oss-120b:free
```
```python
qwen/qwen3-coder:free
```
```python
x-ai/grok-4-fast:free
```

List of models: [https://openrouter.ai/models?order=pricing-low-to-high](https://openrouter.ai/models?order=pricing-low-to-high) 

> OpenRouter offers both free API access or paid under “pay-as-you-go” subscription offering nearly all mainstream models.

## Groq (free)

API url:  https://api.groq.com/openai/v1/chat/completions

Where to obtain API key: https://console.groq.com/keys

Available are for example:

```python
openai/gpt-oss-120b
```
```python
openai/gpt-oss-20b
```

List of models: https://console.groq.com/docs/models

> Groq provides open source models, which may have limited capabilites.

## Cerebras

API url: https://api.cerebras.ai/v1/chat/completions
List of models: https://inference-docs.cerebras.ai/models/overview

Available are for example:

```python
gpt-oss-120b
```
```python
llama-4-maverick-17b-128e-instruct
```

Where to obtain API key: https://cloud.cerebras.ai/platform/ (API keys)


## Github

API url: https://models.github.ai/inference/chat/completions

Available are for example:

```
meta/Llama-4-Scout-17B-16E-Instruct
```

```
mistral-ai/Mistral-Large-2411
```

List of models: https://github.com/marketplace/models 

> Click *Model: Select a Model* which provides a list of models. After choosing one click *Use Model* and look for `modelName` in provided code snippets.


## DeepSeek

API url: https://api.deepseek.com/v1/chat/completions
Where to obtain API key: https://platform.deepseek.com/api_keys

```python
deepseek-chat
```

List of models: https://api-docs.deepseek.com/quick_start/pricing

