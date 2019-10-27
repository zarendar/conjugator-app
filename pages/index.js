import {LightTheme, BaseProvider} from 'baseui';

import Home from './home'

export default () => {
  return (
    <BaseProvider theme={LightTheme}>
      <Home />
    </BaseProvider>
  )
}
