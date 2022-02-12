import React, { useState, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import debounce from "lodash.debounce";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: any;
};

// Изменен тип функции onClick
// Это более безопасный тип
interface IButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
// Измененный синтаксис функции и измененная структура props легко читаются.
const Button: React.FC<IButtonProps> = ({ onClick }) => (
  <button type="button" onClick={onClick}>
    get random user
  </button>
);

interface IUserInfoProps {
  user: User;
}
// Измененный синтаксис функции и измененная структура props легко читаются.
const UserInfo: React.FC<IUserInfoProps> = ({ user }) => (
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>Phone number</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{user.name}</td>
        <td>{user.phone}</td>
      </tr>
    </tbody>
  </table>
);

// Измененный синтаксис функции и измененная структура props легко читаются.
const App: React.FC<{}> = () => {
  // Инициализируйте localstorage и назначьте его начальному itemState
  const [userData, setUserData] = useLocalStorage("user", null);
  // Это может быть тип <User>, но если localstorage пуст, это значение null
  const [item, setItem] = useState<User | null>(userData);

  // Добавлен 'try catch' для debugging ошибок.
  const receiveRandomUser = async () => {
    const id = Math.floor(Math.random() * (10 - 1)) + 1;
    try {
      const response = await fetch(`${URL}/${id}`);
      const _user = (await response.json()) as User;

      // Проверяем правильный ответ или нет
      if (
        _user &&
        Object.keys(_user).length === 0 &&
        Object.getPrototypeOf(_user) === Object.prototype
      )
        return alert("Fetch failed!");

      setUserData(_user);
      return setItem(_user);
    } catch (error: any) {
      alert("Fetch failed!");
    }
  };

  // Избегайте вызова нескольких запросов
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(debounce(receiveRandomUser, 300), []);

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={debouncedChangeHandler} />
      {/** Проверить состояние item, не отображать компонент UserInfo, если значение равно null */}
      {item && <UserInfo user={item} />}
    </div>
  );
};

export default App;
