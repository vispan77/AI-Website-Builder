const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

const modal = "inclusionai/ring-2.6-1t:free";

const generateResponse = async (prompt) => {
    const response = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'openai/gpt-5.2',
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

    console.log("reponse from the open router = ", response);

    //check the response
    if(!response.ok){
        const error = await response.text();
        throw new Error("Open router error = ", error);
    }

    const data = await response.json();
    return data;

}