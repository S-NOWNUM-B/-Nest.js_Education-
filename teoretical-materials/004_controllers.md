# Контроллеры (Controllers)

**Контроллеры** — это слой, который отвечает за обработку входящих HTTP-запросов и формирование ответов для клиента. Задача контроллера — принять запрос (исходя из URL, метода HTTP и параметров), делегировать сложную бизнес-логику в провайдеры (сервисы) и вернуть правильный результат или ошибку обратно клиенту.

Вся маршрутизация в NestJS описывается с помощью декораторов. Контроллеры определяются классом, аннотированным декоратором `@Controller()`.

---

## Создание контроллера

Создать контроллер можно вручную, но удобнее всего использовать Nest CLI:
```bash
nest g controller users
```
Эта команда не только создаст файл `users.controller.ts`, но и автоматически добавит его в `UsersModule` в массив `controllers`.

### Базовый пример

В декоратор `@Controller('prefix')` передается опциональный префикс маршрута. Все эндпоинты внутри этого класса будут начинаться с этого префикса.

```typescript
import { Controller, Get, Post, HttpCode } from '@nestjs/common';

@Controller('users') // Базовый путь: /users
export class UsersController {
  
  @Get() // Обработает GET /users
  findAll(): string {
    return 'Возвращаем всех пользователей';
  }

  @Post() // Обработает POST /users
  @HttpCode(201) // Явно указываем статус-код
  create(): string {
    return 'Пользователь успешно создан';
  }
}
```

---

## Методы и декораторы HTTP

NestJS предоставляет декораторы для всех стандартных HTTP-методов:
*   `@Get()`
*   `@Post()`
*   `@Put()`
*   `@Delete()`
*   `@Patch()`
*   `@Options()`
*   `@Head()`
*   `@All()` — обработка всех методов сразу.

Вы можете добавить дополнительный путь внутрь декоратора метода.
Например, `@Get('profile')` внутри `@Controller('users')` будет обрабатывать запрос на маршрут `GET /users/profile`.

---

## Доступ к объекту Request (Запрос)

Часто контроллеру нужно получить данные из запроса: параметры URL (Params), строки запроса (Query) или тело запроса (Body). NestJS использует для этого специальные декораторы, которые внедряются в аргументы метода.

```typescript
import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  
  // GET /users/:id (например: /users/123)
  @Get(':id')
  findOne(@Param('id') userId: string) {
    return `Возвращаем пользователя с ID: ${userId}`;
  }

  // GET /users/search?role=admin (получение query параметров)
  @Query('search')
  searchUsers(@Query('role') role: string) {
    return `Ищем пользователей с ролью: ${role}`;
  }

  // POST /users (получение тела запроса)
  @Post()
  create(@Body() payload: any) {
    // В реальном приложении вместо any используется DTO (Data Transfer Object)
    return `Создан пользователь с именем: ${payload.name}`;
  }
}
```

### Основные декораторы параметров:
*   `@Req()` или `@Request()` — доступ к сырому объекту запроса `req` (от Express или Fastify). **Использовать не рекомендуется**, так как это привязывает код к конкретной платформе.
*   `@Res()` или `@Response()` — сырой ответ `res`.
*   `@Body(key?)` — `req.body` или `req.body[key]`
*   `@Query(key?)` — `req.query` или `req.query[key]`
*   `@Param(key?)` — `req.params` или `req.params[key]`
*   `@Headers(name?)` — `req.headers` или `req.headers[name]`

---

## Статус-коды и Заголовки

По умолчанию для GET, DELETE, PUT и PATCH запросов (если все прошло успешно) Nest возвращает статус **200 (OK)**, а для POST — **201 (Created)**.

Изменить это поведение можно декоратором `@HttpCode()`.
Добавить или переопределить HTTP-заголовки можно с помощью декоратора `@Header()`.

```typescript
import { Controller, Post, HttpCode, Header } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  create() {
    return 'Котик создан';
  }
}
```

---

## Итог

Контроллеры в NestJS должны оставаться **максимально худыми**. Их единственная цель:
1. Принять запрос.
2. Проверить входящие данные (с помощью Pipes).
3. Передать данные в Сервис (Provider).
4. Вернуть результат клиенту.

А вот о том, где и как должна лежать сложная бизнес-логика, мы поговорим в следующей главе: **Providers и Services**.
