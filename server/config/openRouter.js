const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

const model = "openai/gpt-oss-120b:free";
// const model = "inclusionai/ring-2.6-1t:free";

const generateResponse = async (prompt) => {
    const response = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "system",
                    content: "You must return ONLY valid raw JSON"
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2
        }),
    });

    

    //check the response
    if(!response.ok){
        const error = await response.text();
        throw new Error(`Open router error = ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

export default generateResponse;