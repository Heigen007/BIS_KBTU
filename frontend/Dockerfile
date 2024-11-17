# Этап сборки
FROM node:18 AS build-stage

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Сборка приложения
RUN npm run build

# Этап для сервера
FROM nginx:alpine AS production-stage

# Копируем сгенерированные статические файлы в Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Открываем порт 80 (стандартный порт Nginx)
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
