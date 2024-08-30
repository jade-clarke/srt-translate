/*
  This is a "module" file that will be used to access the @google-cloud/translate API.
*/
const { GoogleAuth } = require("google-auth-library");
const { Translate } = require("@google-cloud/translate").v2;

// Authenticate the client
async function authClient() {
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    return await auth.getClient();
  } catch (error) {
    return error;
  }
}

// Check if a language code is valid
function checkLanguages(code) {
  const languagesJSON = require("../languages.json");

  const check = languagesJSON.languages.filter(
    (language) => language.code === code
  );

  return check.length === 1 ? check[0] : undefined;
}

// Translate a provided string
async function translateText(client, text, target) {
  const translate = new Translate({ authClient: client });

  const [translation] = await translate.translate(text, target);

  return translation;
}

module.exports = { authClient, checkLanguages, translateText };
