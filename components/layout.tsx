import * as React from 'react'
import { LightTheme, BaseProvider } from 'baseui'
import { Block } from 'baseui/block'

import Search from './search'

interface PropsT {
  children: React.ReactNode
}

function Layout({ children }: PropsT) {
	return (
    <BaseProvider theme={LightTheme}>
      <Block padding={'scale300'}>
        <Search />
        <Block paddingTop={'scale300'} paddingBottom={'scale300'}>
          {children}
        </Block>
      </Block>
		</BaseProvider>
	)
}

export default Layout
