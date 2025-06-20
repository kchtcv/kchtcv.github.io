export let t = (key) => key;

export async function loadLang(lang) {
  let res = await fetch(`./i18n/${lang}.json`);
  if (!res.ok) throw new Error("Language JSON not found");
  let dict = await res.json();
  t = (key) => dict[key] || key;
}
