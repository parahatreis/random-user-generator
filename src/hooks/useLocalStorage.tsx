import { useState } from "react";

// Hook для использования local storage
export const useLocalStorage = (key: string, initialValue: any) => {
  // Передаем функцию начального состояния в useState, чтобы логика выполнялась только один раз
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Получить из локального хранилища по ключу
      const item = window.localStorage.getItem(key);
      // Разбираем сохраненный json или, если нет, возвращаем initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Если ошибка, также возвращаем initialValue
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      // Разрешить значение быть функцией, чтобы у нас был тот же API, что и у useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Сохранить состояние
      setStoredValue(valueToStore);
      // Сохраняем в локальное хранилище
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
