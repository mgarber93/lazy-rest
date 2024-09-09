import {render} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {Provider} from 'react-redux'

import {ApiForm} from './api-form'
import {createStore} from '../features/store'

describe("ApiForm tests", () => {
  let store: ReturnType<typeof createStore>
  beforeAll(() => {
    store = createStore()
  })
  it("should successfully trigger the file input event", async () => {
    const result = render(<Provider store={store}><ApiForm/></Provider>)
    const file = new File(['dummy content'], 'dummy.yaml', {type: 'application/yaml'})
    const fileInput = result.getByLabelText(/Open Api Spec/i)
    await userEvent.upload(fileInput, file)
    const {tools} = store.getState()
    expect(Object.values(tools.api)).toHaveLength(0) //@todo update test to handleFile
  })
})
