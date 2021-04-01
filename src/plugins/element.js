import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Form, FormItem, Input, Button, Message } from 'element-ui'
import { Container,Header,Aside,Main,Menu,MenuItem,MenuItemGroup,Submenu } from 'element-ui'

Vue.prototype.$message = Message;
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);