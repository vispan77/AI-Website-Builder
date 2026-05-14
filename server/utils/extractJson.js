const extractJson = async (raw) => {
    if (!raw) {
        return
    }

    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const firstCurlyBrace = cleaned.indexOf("{");
    const lastCurlyBrace = cleaned.lastIndexOf("}");
    if (firstCurlyBrace === -1 || lastCurlyBrace === -1) return null;

    const jsonString = cleaned.slice(firstCurlyBrace, lastCurlyBrace + 1);

    return JSON.parse(jsonString);
}

export default extractJson;