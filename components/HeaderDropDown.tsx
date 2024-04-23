import Colors from '@/constants/Colors';
import { Text, View } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

export type Props = {
  title: string;
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  selected?: string;
  onSelect: (key: string) => void;
};

const HeaderDropDown = ({ title, selected, items, onSelect }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>{title}</Text>
          {selected && (
            <Text
              style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: Colors.greyLight }}>
              {selected} &gt;
            </Text>
          )}
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
export default HeaderDropDown;
