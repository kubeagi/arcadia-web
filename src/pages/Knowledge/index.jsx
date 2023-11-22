// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Page,
  Row,
  Col,
  Typography,
  Card,
  Space,
  Button,
  Input,
  List,
  Dropdown,
  Image,
  Divider,
  Descriptions,
  Status,
  Pagination,
} from '@tenx-ui/materials';

import {
  AntdIconPlusOutlined,
  TenxIconRefresh,
  AntdIconSettingOutlined,
} from '@tenx-ui/icon-materials';

import { useLocation, matchPath } from '@umijs/max';
import { DataProvider } from 'shared-components';
import qs from 'query-string';
import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';

import utils from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class Corpus$$Page extends React.Component {
  get location() {
    return this.props.self?.location;
  }
  get match() {
    return this.props.self?.match;
  }
  get history() {
    return this.props.self?.history;
  }
  get appHelper() {
    return this.props.self?.appHelper;
  }

  _context = this;

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    __$$i18n._inject2(this);

    this.state = { corpusList: [], searchName: '', loading: false };
  }

  $ = () => null;

  $$ = () => [];

  componentWillUnmount() {
    console.log('will unmount');
  }

  returnTxt(item) {
    console.log(item, 'eeeee');
    return item;
  }

  getStatusType(item) {
    if (item.status === 'True') {
      return 'success';
    } else if (item.status === 'False') {
      return 'error';
    } else {
      return 'unknow';
    }
  }

  getDataStatus(isStatus, isTag) {
    return [
      // 导入中
      {
        type: 'primary',
        [isStatus ? 'id' : 'value']: 'process',
        [isStatus || isTag ? 'children' : 'text']: '数据处理中',
      },
      // 连接成功
      {
        type: 'success',
        [isStatus ? 'id' : 'value']: 'success',
        [isStatus || isTag ? 'children' : 'text']: '数据处理完成',
      },
      {
        // 连接异常
        type: 'error',
        [isStatus ? 'id' : 'value']: 'error',
        [isStatus || isTag ? 'children' : 'text']: '数据处理失败',
      },
    ];
  }

  testFunc() {
    console.log('test aliLowcode func');
    return <div className="test-aliLowcode-func">{this.state.test}</div>;
  }

  onSearch(name) {
    this.setState(
      {
        searchName: name,
      },
      () => {
        this.getData(name);
      }
    );
  }

  getData() {
    this.setState({
      loading: true,
    });
    const project = JSON.parse(localStorage.getItem('authData')).project;
    this.utils.bff
      .listKnowledgeBases({
        input: {
          namespace: project,
          name: this.state.searchName,
        },
      })
      .then(res => {
        const { KnowledgeBase } = res;
        const { listKnowledgeBases } = KnowledgeBase || {};
        const { nodes, totalCount } = listKnowledgeBases || {};
        this.setState({
          corpusList: nodes || [],
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          corpusList: [],
          loading: false,
        });
      });
  }

  getData1() {
    console.log(this, this.bff, this.util);
    const query = `
      fragment obj on TypedObjectReference {
  apiGroup
  kind
  Name
  Namespace
}

fragment kb on KnowledgeBase {
  name
  namespace
  displayName
  embedder {
    ...obj
  }
  vectorStore {
    ...obj
  }
  fileGroups {
    source {
      ...obj
    }
    path
  }
  status
  updateTimestamp
  description
}
query listkb {
  KnowledgeBase {
    listKnowledgeBases(input: {namespace: "arcadia"}) {
      hasNextPage
      nodes {
        ...kb
      }
      totalCount
    }
  }
}
    `;
    fetch('https://portal.172.22.96.136.nip.io/kubeagi-apis/bff', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImExNDU0Y2VmNjNmNmM1ZTNhODYxYzY3YmVlZTZkYTgxYjc1ZTExMzQifQ.eyJpc3MiOiJodHRwczovL3BvcnRhbC4xNzIuMjIuOTYuMTM2Lm5pcC5pby9vaWRjIiwic3ViIjoiQ2dWaFpHMXBiaElHYXpoelkzSmsiLCJhdWQiOiJiZmYtY2xpZW50IiwiZXhwIjoxNzAwNzIyNzQzLCJpYXQiOjE3MDA2MzYzNDMsImF0X2hhc2giOiJUTzR5NVEzQVdVRDcwQmVkSzN3RER3IiwiY19oYXNoIjoiUEdONGc2SmQ1RnVoTkRwLXdJTy1qUSIsImVtYWlsIjoiYWRtaW5AdGVueGNsb3VkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJncm91cHMiOlsic3lzdGVtOm1hc3RlcnMiLCJpYW0udGVueGNsb3VkLmNvbSIsIm9ic2VydmFiaWxpdHkiLCJyZXNvdXJjZS1yZWFkZXIiLCJvYnNldmFiaWxpdHkiXSwibmFtZSI6ImFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJwaG9uZSI6IiIsInVzZXJpZCI6ImFkbWluIn0.NrAjZeHWbZbMEPgSJcO4rhHCv31c36l0M8Hnhaivm_68ATxNXwx3AAJ7VmnKILeg3D9MY5DWKy6qJOsPgRsIFNcB-CthLKlYlT-MWNSFv_-QefbBnIwtjByRb2B1hFovyF43ICJUgIdQpJoYckwT9CvFFlPVX4IBLHnduaPiQaLiMP6rwC3KNCi88KeWrqAEJbZZ5yww9qQvtC38mCrAkX-p_SxY7bkXb3MEVF926Sp7tphqpQGKAZuMlwCN6Wy44LysKlw_CvXpAuX3lfN0MQfCBvlUb6ie0ab07jLFgilu3Y9sJNOBSuzipwphIuAK_9GaG7oKmK0vU3QsrdjoXw`,
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res, 'res');
        const { data } = res;
        const { KnowledgeBase } = data || {};
        const { nodes, totalCount } = KnowledgeBase.listKnowledgeBases || {};
        console.log(nodes, 'nodes');
        this.setState({
          corpusList: nodes || [],
        });
      });
  }

  componentDidMount() {
    console.log('did mount', this.utils.bff);
    this.getData();
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Typography.Title
              bold={true}
              level={1}
              bordered={false}
              ellipsis={true}
              __component_name="Typography.Title"
            >
              {this.i18n('i18n-38tkeb1r') /* 知识库管理 */}
            </Typography.Title>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="inner"
              style={{ paddingTop: '4px', paddingBottom: '16px' }}
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Row wrap={true} __component_name="Row">
                <Col span={24} __component_name="Col">
                  <Space align="center" direction="horizontal" __component_name="Space">
                    <Button
                      href="/add/corpus"
                      icon={<AntdIconPlusOutlined __component_name="AntdIconPlusOutlined" />}
                      type="primary"
                      block={false}
                      ghost={false}
                      shape="default"
                      danger={false}
                      disabled={false}
                      __component_name="Button"
                    >
                      {this.i18n('i18n-ueslu0a9') /* 新增知识库 */}
                    </Button>
                    <Button
                      icon={<TenxIconRefresh __component_name="TenxIconRefresh" />}
                      block={false}
                      ghost={false}
                      shape="default"
                      danger={false}
                      onClick={function () {
                        return this.getData.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      disabled={false}
                      __component_name="Button"
                    >
                      {this.i18n('i18n-jskgqh8o') /* 刷新 */}
                    </Button>
                    <Input.Search
                      placeholder={this.i18n('i18n-caihsq7h') /* 请输入知识库名称搜索 */}
                      __component_name="Input.Search"
                      onSearch={function () {
                        return this.onSearch.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                    />
                  </Space>
                </Col>
                <Col span={24} __component_name="Col">
                  <List
                    grid={{ lg: 3, md: 2, sm: 2, xl: 4, xs: 2, xxl: 4, column: 3, gutter: 16 }}
                    size="small"
                    split={false}
                    footer=""
                    header=""
                    rowKey="id"
                    bordered={false}
                    dataSource={__$$eval(() => this.state.corpusList)}
                    gridEnable={true}
                    itemLayout="horizontal"
                    pagination={false}
                    renderItem={
                      /* 插槽容器*/ item =>
                        (__$$context => (
                          <List.Item extra="" actions={[]}>
                            <Card
                              size="default"
                              type="default"
                              style={{ border: '1px solid #E2E2E2' }}
                              actions={[]}
                              loading={false}
                              bordered={false}
                              bodyStyle={{ position: 'relative' }}
                              hoverable={false}
                            >
                              <Row wrap={true} gutter={[0, 0]} __component_name="Row">
                                <Col
                                  span={24}
                                  style={{ right: '24px', position: 'absolute' }}
                                  __component_name="Col"
                                >
                                  <Dropdown
                                    menu={{
                                      items: [
                                        {
                                          key: 'edit',
                                          label: this.i18n('i18n-str3pnrc') /* 编辑 */,
                                        },
                                        {
                                          key: 'delete',
                                          label: this.i18n('i18n-z0idrepg') /* 删除 */,
                                        },
                                      ],
                                    }}
                                    trigger={['hover']}
                                    disabled={false}
                                    placement="bottomLeft"
                                    __component_name="Dropdown"
                                    destroyPopupOnHide={true}
                                  >
                                    <Button
                                      type="default"
                                      block={false}
                                      ghost={false}
                                      shape="default"
                                      style={{
                                        top: '-10px',
                                        float: 'right',
                                        border: 'none',
                                        padding: '0',
                                      }}
                                      danger={false}
                                      disabled={false}
                                      __component_name="Button"
                                    >
                                      {
                                        <AntdIconSettingOutlined __component_name="AntdIconSettingOutlined" />
                                      }
                                    </Button>
                                  </Dropdown>
                                </Col>
                                <Col span={24} __component_name="Col">
                                  <Row
                                    wrap={false}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    gutter={[0, 0]}
                                    __component_name="Row"
                                  >
                                    <Col flex="56px" __component_name="Col">
                                      <Image
                                        src="data:image/png;base64,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"
                                        style={{ borderRadius: '28px' }}
                                        width={56}
                                        height={56}
                                        preview={false}
                                        fallback=""
                                        __component_name="Image"
                                      />
                                    </Col>
                                    <Col flex="auto" __component_name="Col">
                                      <Row
                                        wrap={true}
                                        style={{ paddingLeft: '20px' }}
                                        gutter={[0, 0]}
                                        __component_name="Row"
                                      >
                                        <Col __component_name="Col">
                                          <Typography.Title
                                            bold={true}
                                            level={1}
                                            bordered={false}
                                            ellipsis={true}
                                            __component_name="Typography.Title"
                                          >
                                            {__$$eval(() => item.displayName)}
                                          </Typography.Title>
                                        </Col>
                                        <Col span={24} __component_name="Col">
                                          <Typography.Paragraph
                                            code={false}
                                            mark={false}
                                            style={{ fontSize: '' }}
                                            delete={false}
                                            strong={false}
                                            disabled={false}
                                            editable={false}
                                            ellipsis={{
                                              rows: 2,
                                              tooltip: {
                                                title: __$$eval(() => item.description),
                                                _unsafe_MixedSetter_title_select: 'VariableSetter',
                                              },
                                              expandable: false,
                                            }}
                                            underline={false}
                                          >
                                            {__$$eval(() => item.description || '--')}
                                          </Typography.Paragraph>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col
                                  span={24}
                                  style={{ height: '36px', marginBottom: '-15px' }}
                                  __component_name="Col"
                                >
                                  <Divider
                                    mode="line"
                                    style={{ width: 'calc(100% + 48px)', marginLeft: '-24px' }}
                                    dashed={false}
                                    defaultOpen={false}
                                    __component_name="Divider"
                                  />
                                </Col>
                              </Row>
                              <Row wrap={true} __component_name="Row">
                                <Col span={24} __component_name="Col">
                                  <Descriptions
                                    id=""
                                    size="default"
                                    colon={true}
                                    items={[
                                      {
                                        key: 'ssfd772g2sk',
                                        span: 1,
                                        label: this.i18n('i18n-gjzse85o') /* 状态 */,
                                        children: (
                                          <Status
                                            id={__$$eval(() => __$$context.getStatusType(item))}
                                            types={__$$eval(() =>
                                              __$$context.getDataStatus(__$$context, true)
                                            )}
                                            getTypes={null}
                                            __component_name="Status"
                                          />
                                        ),
                                      },
                                      {
                                        key: '3nv8b79bh9d',
                                        span: 1,
                                        label: this.i18n('i18n-uag94ndq') /* 更新时间 */,
                                        children: (
                                          <Typography.Time
                                            time={__$$eval(() => item.updateTimestamp)}
                                            format=""
                                            relativeTime={false}
                                            __component_name="Typography.Time"
                                          />
                                        ),
                                      },
                                    ]}
                                    title=""
                                    column={1}
                                    layout="horizontal"
                                    bordered={false}
                                    itemStyle={{}}
                                    labelStyle={{ width: '76', padding: '12px 0 0 0' }}
                                    contentStyle={{ padding: '12px 0 0 0' }}
                                    borderedBottom={true}
                                    __component_name="Descriptions"
                                    borderedBottomDashed={true}
                                  />
                                </Col>
                              </Row>
                            </Card>
                          </List.Item>
                        ))(__$$createChildContext(__$$context, { item }))
                    }
                    __component_name="List"
                    loading={__$$eval(() => this.state.loading)}
                  />
                </Col>
                <Col
                  span={24}
                  style={{ display: 'flex', justifyContent: 'center' }}
                  __component_name="Col"
                >
                  <Pagination
                    style={{ display: 'flex', marginTop: '8px' }}
                    total={50}
                    simple={false}
                    current={1}
                    pageSize={10}
                    __component_name="Pagination"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

const PageWrapper = () => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/corpus' }, location.pathname);
  history.match = match;
  history.query = qs.parse(location.search);
  const appHelper = {
    utils,
    location,
    match,
    history,
  };
  const self = {
    appHelper,
    ...appHelper,
  };
  return (
    <DataProvider
      self={self}
      sdkInitFunc={{
        enabled: undefined,
        func: 'undefined',
        params: undefined,
      }}
      sdkSwrFuncs={[
        {
          func: 'undefined',
          params: undefined,
          enableLocationSearch: undefined,
        },
      ]}
      render={dataProps => <Corpus$$Page {...dataProps} self={self} appHelper={appHelper} />}
    />
  );
};
export default PageWrapper;

function __$$eval(expr) {
  try {
    return expr();
  } catch (error) { }
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}

function __$$createChildContext(oldContext, ext) {
  const childContext = {
    ...oldContext,
    ...ext,
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
