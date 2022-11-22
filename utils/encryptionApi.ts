import crypto from "crypto";
let algorithm = "aes-256-cbc";
let key = "Zq69vern5kq7yLlIU0JyRGbbORzHpe6W";
let secretiv = "797517417422AB8FBCD7F5F36C6BA";

export const encryptText = (text) => {
  if (typeof text === "object") {
    text = JSON.stringify(text);
  }

  let keystring = crypto
    .createHash("sha256")
    .update(String(key))
    .digest("hex")
    .substr(0, 32);

  let ivv = crypto
    .createHash("sha256")
    .update(String(secretiv))
    .digest("hex")
    .substr(0, 16);

  const cipher = crypto.createCipheriv(algorithm, keystring, ivv);
  const encrypted =
    cipher.update(text, "utf8", "base64") + cipher.final("base64");
  return encrypted;
};

export const decryptText = (encrypted) => {
  encrypted = encrypted ? encrypted.toString().replace(" ", "+") : "";
  while (encrypted.indexOf(" ") > -1) {
    encrypted = encrypted.toString().replace(" ", "+");
  }

  try {
    let buff = Buffer.from(encrypted, "base64");
    let text = buff.toString("ascii");

    let keystringBuffer = crypto
      .createHash("sha256")
      .update(String(key))
      .digest("hex")
      .substr(0, 32);
    let ivvBuffer = crypto
      .createHash("sha256")
      .update(String(secretiv))
      .digest("hex")
      .substr(0, 16);

    let decipherBuffer = crypto.createDecipheriv(
      algorithm,
      keystringBuffer,
      ivvBuffer
    );

    let decBuffer = decipherBuffer.update(text, "base64", "utf8");
    decBuffer += decipherBuffer.final();
    return decBuffer;
  } catch {
    try {
      let keystring = crypto
        .createHash("sha256")
        .update(String(key))
        .digest("hex")
        .substr(0, 32);
      let ivv = crypto
        .createHash("sha256")
        .update(String(secretiv))
        .digest("hex")
        .substr(0, 16);

      let decipher = crypto.createDecipheriv(algorithm, keystring, ivv);

      let dec = decipher.update(encrypted, "base64", "utf8");
      dec += decipher.final();
      try {
        return JSON.parse(dec);
      } catch {
        return dec;
      }
    } catch (e) {
      return encrypted;
    }
  }
};
