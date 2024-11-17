# Устанавливаем образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем исходный код приложения
COPY . .

# Указываем порт, который будет слушать Node.js сервер
EXPOSE 3000

# Запуск приложения
CMD ["node", "index"]
