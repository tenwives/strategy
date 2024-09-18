import {Button, Dialog, Form, Input, ProgressBar, Skeleton, Stepper, Switch} from 'antd-mobile'
import {useState} from 'react';

let nextId = 1;
const App = () => {
    const [orders, setOrders] = useState([])
    const [current, setCurrent] = useState(0.008)
    const [sell, setSell] = useState(false)
    const [form] = Form.useForm()

    const onSubmit = (event) => {
        event.preventDefault();
        const values = form.getFieldsValue()
        if (values.sell) {
            let size = orders.length
            const price = Number(values.price)
            orders.some((item) => {
                console.log(item)
                if (!item.sold && !item.sell && Number(item.price) < price) {
                    item.sold = price
                    const all = [{
                        id: nextId++,
                        ...values,
                    }, ...orders]
                    all.sort(function (a, b) {
                        return a.sold ? -1 : Number(a.price) - Number(b.price)
                    });
                    setOrders(all)
                    size = all.length

                    Dialog.alert({
                        content: '成功售出',
                        onConfirm: () => {
                            console.log('Confirmed')
                        },
                    })
                    return true;
                }
            })
            if (size === orders.length) {
                Dialog.alert({
                    content: '无法售出',
                    onConfirm: () => {
                        console.log('Confirmed')
                    },
                })
            }
        } else {
            const all = [{
                id: nextId++,
                ...values,
            }, ...orders]
            all.sort(function (a, b) {
                return Number(a.price) - Number(b.price)
            });
            setOrders(all)
        }
    }
    const Order = ({id, price, amount, sell, sold}) => {
        const start = sold ? sold : current;
        const per = start > price ? (start - price) / price : (price - start) / price;
        const gain = amount * (start - price).toFixed(4);
        const color = start < price ? 'var(--adm-color-danger)' : 'var(--adm-color-success)';
        const text = price + ' x ' + amount + '\t(' + id + ')\t' + gain;
        const finish = sold ? '#CDFFE2' : '#CDE2FF';

        return sell ? <ProgressBar percent={100} style={{
            '--text-width': '200px',
            '--track-width': '1px',
            '--fill-color': 'var(--adm-color-success)',
        }} text={price}/> : <ProgressBar
            percent={per * 100}
            style={{
                '--text-width': '200px',
                '--fill-color': color,
                '--track-color': finish,
                '--track-width': '2px',
            }}
            text={sold ? '已售 +' + gain : text}
        />
    }

    return (
        <div>

            <Form
                layout='horizontal'
                form={form}
                footer={
                    <Button block type='submit' color={sell ? 'danger' : 'primary'} size='large' onClick={onSubmit}>
                        提交
                    </Button>
                }
            >
                <Form.Header>记录订单</Form.Header>
                <Form.Item
                    label='当前价格'
                    name="current"
                >
                    <Input type="number"
                           name="current"
                           value={current}
                           onChange={val => {
                               setCurrent(val)
                           }}
                           placeholder='输入当前价格'/>
                </Form.Item>
                <Form.Item
                    name='price'
                    label='价格'
                    rules={[{required: true, message: '请输入价格'}]}
                >
                    <Input type="number" placeholder='输入价格'/>
                </Form.Item>
                <Form.Item
                    initialValue={2000}
                    rules={[
                        {
                            max: 1000000,
                            min: 2000,
                            type: 'number',
                        },
                    ]}
                    name='amount'
                    label='数量'
                >
                    <Stepper disabled={orders.length > 0} step={1000}/>
                </Form.Item>
                <Form.Item
                    name='sell'
                    label='方向'
                >
                    <Switch onChange={checked => setSell(checked)}
                            style={{'--checked-color': 'var(--adm-color-danger)'}} uncheckedText='B' checkedText='S'/>
                </Form.Item>
            </Form>

            {orders.length > 0 ?
                <div>
                    {orders.map(one => !one.sell && (
                        <Order key={one.id} id={one.id} sold={one.sold} sell={one.sell} amount={one.amount}
                               price={one.price}></Order>))}  </div> : <Skeleton.Paragraph lineCount={15} animated/>}
        </div>
    )
}

export default App
