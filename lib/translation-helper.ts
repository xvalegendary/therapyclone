import { translations, type Language } from "@/lib/translations"

/**
 * Хелпер для получения перевода по ключу с поддержкой вложенных объектов
 * @param language Текущий язык
 * @param key Ключ перевода (может быть вложенным, например "account.login")
 * @param fallback Запасное значение, если перевод не найден
 */
export function getTranslation(language: Language, key: string, fallback = ""): string {
  const keys = key.split(".")
  let result: any = translations[language]

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k]
    } else {
      return fallback
    }
  }

  return typeof result === "string" ? result : fallback
}

/**
 * Создает функцию перевода для конкретного языка
 * @param language Язык для переводов
 */
export function createTranslator(language: Language) {
  return (key: string, fallback = "") => getTranslation(language, key, fallback)
}
