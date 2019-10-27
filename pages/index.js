import {LightTheme, BaseProvider} from 'baseui';

import Home from './conjugate'

export default (props) => {
  return (
    <BaseProvider theme={LightTheme}>
      <Home />
    </BaseProvider>
  )
}
