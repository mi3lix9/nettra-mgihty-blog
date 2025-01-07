export default /**
 * Splits a given text into chunks so that no chunk exceeds maxLength.
 * Preserves line structure: it doesn't break lines in the middle.
 *
 * @param text - The full text to split.
 * @param maxLength - The maximum length allowed per message (default 4096).
 * @returns An array of message chunks.
 */
function splitTelegramMessage(
  text: string,
  maxLength: number = 4096
): string[] {
  const lines = text.split("\n");
  const messages: string[] = [];
  let currentMessage = "";

  for (const line of lines) {
    // If adding the new line exceeds the limit, push the current chunk and start a new one
    if ((currentMessage + line + "\n").length > maxLength) {
      messages.push(currentMessage.trimEnd());
      currentMessage = line + "\n";
    } else {
      currentMessage += line + "\n";
    }
  }

  // Push the final chunk if it's not empty
  if (currentMessage.trim().length > 0) {
    messages.push(currentMessage.trimEnd());
  }

  return messages;
}
