'use client';

import { Accordion } from '@accelint/design-toolkit/accordion';
import { Avatar } from '@accelint/design-toolkit/avatar';
import { Badge } from '@accelint/design-toolkit/badge';
import { Box } from '@accelint/design-toolkit/box';
import { Button } from '@accelint/design-toolkit/button';
import { Checkbox } from '@accelint/design-toolkit/checkbox';
import { Chip } from '@accelint/design-toolkit/chip';
import { ClassificationBadge } from '@accelint/design-toolkit/classification-badge';
import { ClassificationBanner } from '@accelint/design-toolkit/classification-banner';
import { ColorPicker } from '@accelint/design-toolkit/color-picker';
import { ComboBoxField } from '@accelint/design-toolkit/combobox-field';
import { DateField } from '@accelint/design-toolkit/date-field';
import { Dialog } from '@accelint/design-toolkit/dialog';
import { Icon } from '@accelint/design-toolkit/icon';
import { Label } from '@accelint/design-toolkit/label';
import { Options } from '@accelint/design-toolkit/options';
import { Popover } from '@accelint/design-toolkit/popover';
import { Radio } from '@accelint/design-toolkit/radio';
import { SearchField } from '@accelint/design-toolkit/search-field';
import { Skeleton } from '@accelint/design-toolkit/skeleton';
import { Slider } from '@accelint/design-toolkit/slider';
import { Switch } from '@accelint/design-toolkit/switch';
import { Tabs } from '@accelint/design-toolkit/tabs';
import { TextAreaField } from '@accelint/design-toolkit/text-area-field';
import { TextField } from '@accelint/design-toolkit/text-field';
import { Tooltip } from '@accelint/design-toolkit/tooltip';

import PlaceholderIcon from '@accelint/icons/placeholder';
import { PreviewGrid } from '~/components/preview-grid';

const noop = () => {
  //
};

const colorOptions = [
  '#ECECE6',
  '#898989',
  '#62a6ff',
  '#30D27E',
  '#FCA400',
  '#D4231D',
];

export default function Page() {
  return (
    <PreviewGrid>
      <PreviewGrid.Item>
        <Accordion>
          <Accordion.Header>
            <Accordion.Trigger>Accordion title</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Accordion content</Accordion.Panel>
        </Accordion>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Avatar
          imageProps={{
            src: 'https://placedog.net/100x100?id=144',
            alt: 'Cute Doggie',
          }}
        />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Badge variant='info'>99+</Badge>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Box>Box</Box>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Button variant='filled' color='info'>
          Button
        </Button>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Checkbox>Checkbox</Checkbox>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Chip.List onRemove={noop}>
          <Chip.Selectable>Chip</Chip.Selectable>
          <Chip.Deletable>Chip</Chip.Deletable>
        </Chip.List>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <ClassificationBadge variant='unclassified' />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <ClassificationBanner variant='unclassified' />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <ColorPicker items={colorOptions} />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <ComboBoxField>
          <Options.Item textValue='Item 1'>
            <Options.Item.Label>Item 1</Options.Item.Label>
          </Options.Item>
          <Options.Item textValue='Item 2'>
            <Options.Item.Label>Item 2</Options.Item.Label>
          </Options.Item>
        </ComboBoxField>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <DateField />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Dialog isDismissable isKeyboardDismissDisabled>
          <Button>Open</Button>
          <Dialog.Body>{() => <></>}</Dialog.Body>
        </Dialog>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Icon>
          <PlaceholderIcon />
        </Icon>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Label>Label</Label>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Options>
          <Options.Item>Item</Options.Item>
        </Options>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Popover>
          <Popover.Trigger>
            <Icon>
              <PlaceholderIcon />
            </Icon>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Popover Title</Popover.Title>
            <Popover.Body>
              Lorum Ipsum text for the dialog shall go here.
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Radio.Group>
          <Radio value='1' />
        </Radio.Group>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <SearchField />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Slider
          orientation='horizontal'
          layout='stacked'
          label='Slider'
          minValue={0}
          maxValue={100}
          defaultValue={30}
        />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Skeleton>Loading content...</Skeleton>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Switch />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Tabs>
          <Tabs.List>
            <Tabs.Tab id='Tab-1'>Tab 1</Tabs.Tab>
            <Tabs.Tab id='Tab-2'>Tab 2</Tabs.Tab>
            <Tabs.Tab id='Tab-3'>Tab 3</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <TextAreaField />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <TextField />
      </PreviewGrid.Item>
      <PreviewGrid.Item>
        <Tooltip>
          <Tooltip.Trigger>
            <span>Tooltip</span>
          </Tooltip.Trigger>
          <Tooltip.Body>tooltip</Tooltip.Body>
        </Tooltip>
      </PreviewGrid.Item>
    </PreviewGrid>
  );
}
