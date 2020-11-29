import * as S from './Service1'

test('the data is some data 1', async () => {
  const data = await S.fetchData1()

  expect(data).toBe('some data 1')
})
