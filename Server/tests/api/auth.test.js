import request from 'supertest';
import { describe, jest, test, expect, beforeEach } from '@jest/globals';
import express from 'express';

jest.resetModules();

describe('Auth API Routes', () => {
  let app;
  let pool, bcrypt, jwt;

  beforeEach(async () => {
    jest.resetModules();

    jest.unstable_mockModule('../../config/db.js', () => ({
        default: {
            query: jest.fn()
        }
    }));

    jest.unstable_mockModule('bcryptjs', () => ({
        default: {
            hash: jest.fn(),
            compare: jest.fn(() => Promise.resolve(false)) // default значение
        }
    }));

    jest.unstable_mockModule('jsonwebtoken', () => ({
        default: {
            sign: jest.fn(),
            verify: jest.fn()
        }
    }));

    jest.unstable_mockModule('pg', () => {
        const mockPool = {
            query: jest.fn(),
            connect: jest.fn(),
            end: jest.fn(),
            on: jest.fn(),
        };
        return {
            Pool: jest.fn(() => mockPool)
        };
    });

    // Импортируем ПОСЛЕ моков
    const { default: loginRouter } = await import('../../routes/auth/login.js');
    const { default: registerRouter } = await import('../../routes/auth/register.js');
    const { default: resetRouter } = await import('../../routes/auth/reset.js');
    const { default: dbPool } = await import('../../config/db.js');
    const { default: bcryptjs } = await import('bcryptjs');
    const { default: jsonwebtoken } = await import('jsonwebtoken');

    pool = dbPool;
    bcrypt = bcryptjs;
    jwt = jsonwebtoken;

    // Создаем НОВОЕ приложение для каждого теста
    app = express();
    app.use(express.json());
    app.use('/api/users', loginRouter);
    app.use('/api/users', registerRouter);
    app.use('/api/users', resetRouter);

    // Очищаем ВСЕ моки
    jest.clearAllMocks();
  });

  describe('POST /api/users/login', () => {

    test('should return token and user data for valid credentials', async () => {
      const mockUser = {
        id: 1, 
        name: 'Имя пользователя', 
        email: 'first@mail.com', 
        password_hash: 'hashed_password'
      };

      const mockToken = 'mock_jwt_token';

      pool.query.mockResolvedValue({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(true); 
      jwt.sign.mockReturnValue(mockToken);

      const requestData = {
        email: 'first@mail.com',
        password: 'password'
      };
      
      const response = await request(app)
        .post('/api/users/login')
        .send(requestData)
        .expect(200);
        

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe(mockToken);
    });

    //Неверный пароль
     test('should return 401 for wrong password', async () => {
      const mockUser = {
        id: 1,
        name: 'Имя пользователя',
        email: 'first@mail.com', 
        password_hash: 'hashed_password'
      };

      // Настраиваем моки
      pool.query.mockResolvedValue({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(false); 

      const requestData = {
        email: 'first@mail.com',
        password: 'wrong-password'
      };
      
      const response = await request(app)
        .post('/api/users/login')
        .send(requestData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    //Несуществующий пользователь
    test('should return 401 for non-existent user', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const requestData = {
        email: 'first@mail.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(requestData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Неверный логин или пароль');
    });

    //Тест на несуществующего пользователя
    test('should return 401 for non-existent user', async () => {
        pool.query.mockResolvedValue({ rows: [] })

        const requestData = {
            email: 'first@mail.com',
            password: 'password'
        }

        const response = await request(app)
            .post('/api/users/login')
            .send(requestData)
            .expect(401)

        expect(response.body.success).toBe(false)
        expect(response.body.message).toContain('Неверный логин или пароль')
    })

    //Тест на отсутствие почты
    test('should return 400 for missing email', async () => {

        const mockUsers = [
            {id: 1, name: 'Имя пользователя', email: 'first@mail.com', password_hash: 'hashed_password' }
        ]

        pool.query.mockResolvedValue({ rows: mockUsers })

        const requestData = {
            password: 'password'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(requestData)
            .expect(400);

        expect(response.body.success).toBe(false)
    });

    //Тест на отсутствие пароля
    test('should return 400 for missing password', async () => {

        const mockUsers = [
            {id: 1, name: 'Имя пользователя', email: 'first@mail.com', password_hash: 'hashed_password' }
        ]

        pool.query.mockResolvedValue({ rows: mockUsers })

        const requestData = {
            email: 'first@mail.com'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(requestData)
            .expect(400);

        expect(response.body.success).toBe(false)
        });
    })

    describe('PUT /api/users/register', () => {

        //Правильный запрос
        test('should return 200 for valid credentials', async () => {

            pool.query
                .mockResolvedValueOnce({ rows: [] }) 
                .mockResolvedValueOnce({ rows: [{ id: 1 }] });

            bcrypt.hash.mockResolvedValue('hashed_password');

            const requestData = {
                name: 'Пользователь',
                email: 'first@mail.com',
                password: 'password'
            }

            const response = await request(app)
                .put('/api/users/register')
                .send(requestData)
                .expect(200);
            
            expect(response.body.success).toBe(true)
            expect(response.body.message).toContain('Пользователь успешно создан')
        })

        //Отсутствие имени
        test('should return 401 for missing name', async () => {

            pool.query.mockResolvedValue({ rows: [] })

            const requestData = {
                email: 'first@mail.com',
                password: 'password'
            };

            const response = await request(app)
                .put('/api/users/register')
                .send(requestData)
                .expect(401);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Не введет пароль, почта или имя')
        })

        //Отсутствие пароля
        test('should return 401 for missing password', async () => {

            pool.query.mockResolvedValue({ rows: [] })

            const requestData = {
                email: 'first@mail.com',
                name: 'Пользователь'
            };

            const response = await request(app)
                .put('/api/users/register')
                .send(requestData)
                .expect(401);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Не введет пароль, почта или имя')
        })

        //Отсутствие почты
        test('should return 401 for missing email', async () => {

            pool.query.mockResolvedValue({ rows: [] })

            const requestData = {
                password: 'password',
                name: 'Пользователь'
            };

            const response = await request(app)
                .put('/api/users/register')
                .send(requestData)
                .expect(401);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Не введет пароль, почта или имя')
        })

        //Если пользователь с такой почтой уже создан
        test('should return 400 if a user with that email already exists ', async () => {

            const mockUsers = {
                id: 1,
                name: 'Пользователь 1',
                email: 'email@mail.com',
                password_hash: 'hashed_password'
            }

            pool.query.mockResolvedValue({ rows: [mockUsers] })

            const requestData = {
                email: 'email@mail.com',
                name: 'Пользователь 2',
                password: 'password'
            }

            const response = await request(app)
                .put('/api/users/register')
                .send(requestData)
                .expect(400);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Пользователь с такой почтой уже есть')
        })
    })

    describe('PATCH /api/users/reset', () => {

        //Правильный запрос
        test('should return 200 for valid credentials', async () => {

            const mockUsers = {
                id: 1,
                name: 'Пользователь 1',
                email: 'email@mail.com',
                password_hash: 'hashed_password'
            }

            pool.query.mockResolvedValue({ rows: [mockUsers] })

            const requestData = {
                email: 'email@mail.com',
                password: 'new-password'
            }

            const response = await request(app)
                .patch('/api/users/reset')
                .send(requestData)
                .expect(200);

            expect(response.body.success).toBe(true)
            expect(response.body.message).toContain('Пароль успешно изменен')
        })

        //Отсутствие пароля
        test('should return 400 for missing password', async () => {

            const mockUsers = {
                id: 1,
                name: 'Пользователь 1',
                email: 'email@mail.com',
                password_hash: 'hashed_password'
            }

            pool.query.mockResolvedValue({ rows: [mockUsers] })

            const requestData = {
                email: 'email@mail.com',
            }

            const response = await request(app)
                .patch('/api/users/reset')
                .send(requestData)
                .expect(400);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Не введен пароль или email')
        })

        //Отсутствует почта
        test('should return 400 for missing email', async () => {

            const mockUsers = {
                id: 1,
                name: 'Пользователь 1',
                email: 'email@mail.com',
                password_hash: 'hashed_password'
            }

            pool.query.mockResolvedValue({ rows: [mockUsers] })

            const requestData = {
                password: 'new-password'
            }

            const response = await request(app)
                .patch('/api/users/reset')
                .send(requestData)
                .expect(400);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Не введен пароль или email')
        })

        //Почта не существует в бд
        test('should return 401 if there is no user with that email in the database', async () => {

            pool.query.mockResolvedValue({ rows: [] })

            const requestData = {
                email: 'new-email@mail.com',
                password: 'new-password'
            }

            const response = await request(app)
                .patch('/api/users/reset')
                .send(requestData)
                .expect(401);

            expect(response.body.success).toBe(false)
            expect(response.body.message).toContain('Пользователь с этой почтой не найден')
        })
    })
})