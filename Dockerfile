FROM node:latest

WORKDIR /app

COPY package*.json ./

# COPY
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

RUN npm install

COPY . .
# 拉取数据库 重新生成prisma.schema
RUN npx prisma db pull
# 根据prisma.schema 生成新的prisma client api(ts支持)
RUN npx prisma generate

EXPOSE 8080
#  以不进行类型检查的方式启动服务
CMD npx ts-node-transpile-only ./src/index.ts