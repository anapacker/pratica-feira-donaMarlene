import app from "../src/app";
import supertest from "supertest";
import { createFruit } from "./factory/fruits.factory";
import httpStatus from "http-status";
import { create } from "domain";
import { Fruit } from "repositories/fruits-repository";

const api = supertest(app)

describe("API POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () =>{
    const body = createFruit()
    console.log(body);
    
    const response = await api.post("/fruits").send(body)
    expect(response.status).toBe(httpStatus.CREATED)
  })

  it("POST /fruits should return 409 when inserting a fruit that is already registered",async () =>{
    const fruit = createFruit("WaterMelon")
    await api.post("/fruits").send(fruit)
    const {status} = await api.post("/fruits").send(fruit) 
    expect(status).toBe(httpStatus.CONFLICT)

  })
  it("POST /fruits should return 422 when inserting a fruit with data missing", async () =>{
    const response = await api.post("/fruits").send({})
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
  })
  
})

describe("API GET /fruits", () => {
  it("should return 404 when inserting an invalid id", async () =>{
    const {status} = await api.get("/fruits/999999")
    expect(status).toBe(httpStatus.NOT_FOUND)
  })

  it("GET /fruits should return 400 when id param is present but not valid", async () => {
    const {status} = await api.get("/fruits/error")
    expect(status).toBe(httpStatus.BAD_REQUEST)
  })

  it("should return one fruit when given a valid and existing id", async () => {
    const fruit = createFruit()
    await api.post("/fruits").send(fruit)
    
    const response = await api.get(`/fruits/1`)
    const fruitInfo = response.body as Fruit

    expect(response.status).toBe(httpStatus.OK)
    expect(fruitInfo.name).toBe(fruit.name)

  })
  it("should return one fruit when given a valid and existing id", async () => {
    const fruit = createFruit()
    await api.post("/fruits").send(fruit)
    
    const response = await api.get(`/fruits/1`)
    const fruitInfo = response.body as Fruit

    expect(response.status).toBe(httpStatus.OK)
    expect(fruitInfo.name).toBe(fruit.name)

  })

  it("should return one fruit when given a valid and existing id", async () => {
    const fruitName = createFruit()
    await api.post("/fruits").send(fruitName)
    
    const response = await api.get(`/fruits/1`)
    const fruitInfo = response.body as Fruit

    expect(response.status).toBe(httpStatus.OK)
    expect(fruitInfo.name).toBe(fruitName.name)

  })

  it("should return all fruits if no id is present",async () => {
    await api.post("/fruits").send(createFruit())
    await api.post("/fruits").send(createFruit())
    
    const {status, body} = await api.get(`/fruits/1`)

    expect(status).toBe(httpStatus.OK)
    expect(body).toHaveLength(2)
  })
})