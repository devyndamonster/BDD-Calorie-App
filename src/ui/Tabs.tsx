import { TabBar } from 'antd-mobile'

export type TabKey = 'log' | 'food' | 'me'

const tabs: { key: TabKey; title: string }[] = [
  { key: 'log', title: 'Log' },
  { key: 'food', title: 'Food' },
  { key: 'me', title: 'Me' },
]

type Props = {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export default function Tabs({ active, onChange }: Props) {
  return (
    <div className="tab-bar" data-testid="tab-bar">
      <TabBar activeKey={active} onChange={(key) => onChange(key as TabKey)}>
        {tabs.map((tab) => (
          <TabBar.Item key={tab.key} title={tab.title} />
        ))}
      </TabBar>
    </div>
  )
}
