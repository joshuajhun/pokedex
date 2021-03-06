import * as helper from './helper.js'
import data from './test-helper/mock-data'
describe('generate-url', () => {

  it('should be a generator and return the correct first value', () => {
    const expectation = { value: "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0", done: false}

    expect(helper.generateUrl().next()).toEqual(expectation)
  })

  it('the string value should increment up', () => {
    const generator = helper.generateUrl()

    expect(generator.next().value).toEqual("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0")
    expect(generator.next().value).toEqual("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20")
  })

  it('string should increment correctly', () => {
    const generator = helper.generateUrl()
    const numerals = [0, 20 , 40, 60, 80, 100, 120, 140]
    const base = 'https://pokeapi.co/api/v2/pokemon/?'

    for(let i=0; i <=6; i++) {
      expect(generator.next()).toEqual({ value:`${base}limit=20&offset=${numerals[i]}`,
                                          done: false })
    }
    expect(generator.next()).toEqual({ value: `${base}limit=11&offset=140`,
                                        done: true})
  })

  describe('Number Generator', () => {
    it('should produce first default value', () => {
      const offsetGen = helper.generateOffset()
      const firstGo = offsetGen.next()
      expect(firstGo.value).toEqual(0)
      expect(!firstGo.done)
    })
    it('should produce the second value', () => {
      const firstExpectation = { value: 0, done: false }
      const secondExpectation = { value: 20, done: false }
      const generator = helper.generateOffset()

      expect(generator.next()).toEqual(firstExpectation)
      expect(generator.next()).toEqual(secondExpectation)
    })

    it('should produce consecutive values', () => {
      const generator = helper.generateOffset()
      const expectations = [0, 20 , 40, 60, 80, 100, 120]

      for(let i=0;i <=6; i++) {
        expect(generator.next()).toEqual({ value: expectations[i], done: false})
      }

      expect(generator.next()).toEqual({ value: 140, done: true})
    })

    it('when finsished should return 11', () => {

      const expectation = { value: 140, done: true }
      const generator = helper.generateOffset()
      const expectations = [0, 20 , 40, 60, 80, 100, 120,]

      for(let i=0;i <=6; i++) {
        expect(generator.next()).toEqual({ value: expectations[i], done: false})
      }

      expect(generator.next()).toEqual(expectation)
    })
  })

  describe('addImage', () => {

    it('should return an object', () => {
      expect(Array.isArray(helper.addImage(data))).toBe(true)
    })

    it('should return an object with a key of image', () => {
      const expectation = helper.addImage(data)

      expect(expectation[0].image).toBeTruthy()
    })

    it('should return an object with the correct url', () => {
      const expectation =  [{
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        name: "bulbasaur",
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      }]

      expect(helper.addImage(data)).toEqual(expectation)
    })
  })
})
