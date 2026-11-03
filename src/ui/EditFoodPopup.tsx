import { Button, Form, Input, Popup } from 'antd-mobile'
import { validateCalories, validateName, type Food } from '../domain/food'

type Props = {
  food: Food
  onSave: (name: string, calories: number, serving: string) => void
  onClose: () => void
}

type FormValues = { name?: string; calories?: string; serving?: string }

const toCalories = (value?: string) => (value === undefined || value.trim() === '' ? NaN : Number(value))

const rule = (error: string | null) => (error ? Promise.reject(new Error(error)) : Promise.resolve())

export default function EditFoodPopup({ food, onSave, onClose }: Props) {
  const [form] = Form.useForm<FormValues>()

  function handleFinish(values: FormValues) {
    onSave(values.name ?? '', toCalories(values.calories), values.serving ?? '')
    onClose()
  }

  return (
    <Popup visible position="bottom" onMaskClick={onClose} bodyStyle={{ padding: 16 }}>
      <div data-testid="edit-food">
        <Form
          form={form}
          name="edit-food"
          layout="vertical"
          initialValues={{ name: food.name, calories: String(food.calories), serving: food.serving ?? '' }}
          onFinish={handleFinish}
          footer={
            <>
              <Button block type="submit" color="primary" size="large">
                Save food
              </Button>
              <Button block size="large" style={{ marginTop: 8 }} onClick={onClose}>
                Cancel
              </Button>
            </>
          }
        >
          <Form.Item
            name="name"
            label="Food name"
            rules={[{ validator: (_, value?: string) => rule(validateName(value ?? '')) }]}
          >
            <Input clearable />
          </Form.Item>
          <Form.Item
            name="calories"
            label="Calories"
            rules={[{ validator: (_, value?: string) => rule(validateCalories(toCalories(value))) }]}
          >
            <Input type="number" inputMode="numeric" />
          </Form.Item>
          <Form.Item name="serving" label="Serving size">
            <Input clearable />
          </Form.Item>
        </Form>
      </div>
    </Popup>
  )
}
