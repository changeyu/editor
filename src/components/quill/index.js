import React, { Component } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import pretty from 'pretty';
import 'react-quill/dist/quill.snow.css';

import extend from 'extend';
import Delta from 'quill-delta';
import './style.css';
import { BoldBlot, ItalicBlot, StrikeBlot } from './formats/bold'
import Hidden, { HiddenItem} from './formats/hidden'
import Hr from './formats/hr'
import Quote from './formats/quote'
import Video from './formats/video'
import Link from './formats/link'
import Img from './formats/img'
// import ScrollBlock from './formats/scroll'
import Counter from './formats/counter'

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(StrikeBlot);
Quill.register({
  'formats/hidden': Hidden,
  'formats/hiddenitem': HiddenItem
},true)
// Quill.register(HiddenItem);
Quill.register(Hr);
Quill.register(Quote);
Quill.register(Video);
Quill.register(Link);
Quill.register(Img);
Quill.register('modules/counter', Counter);

// Quill.register(ScrollBlock);

var toolbarOptions = [
  ['italic', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
];
var bindings = {
  // 删除空的
  list: {
    key: 'backspace',
    format: ['hidden-diy'],
    handler: function (range, context) {
      console.log(context)
      if (context.offset === 0 && context.format) {
        this.quill.format('hidden-diy', false, Quill.sources.USER);
      }else{
        return true
      }
    }
  },
  // 回车时 发现当前段落是空的 去掉样式
  'hidden empty enter': {
    key: 'enter',
    collapsed: true,
    format: ['hidden-diy'],
    empty: true,
    handler: function (range, context) {
      this.quill.format('hidden-diy', false, Quill.sources.USER);
    }
  },
  // 'hidden enter': {
  //   key: 'enter',
  //   collapsed: true,
  //   format: ['hidden-diy'],
  //   handler: function (range) {
  //     let [line, offset] = this.quill.getLine(range.index);
  //     let formats = extend({}, line.formats(), { 'hidden-diy':true });
  //     console.log(formats)
  //     let delta = new Delta().retain(range.index)
  //       .insert('\n', formats)
  //       .retain(line.length() - offset - 1)
  //       .retain(1, { 'hidden-diy': true});
  //     console.log(delta)
  //     this.quill.updateContents(delta, Quill.sources.USER);
  //     this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  //     this.quill.scrollIntoView();
  //     console.log(this.quill)
  //   }
  // },
};

// quill.keyboard.addBinding({ key: Keyboard.keys.ENTER }, {
//   empty: true,    // implies collapsed: true and offset: 0
//   format: ['list']
// }, function (range, context) {
//   this.quill.format('list', false);
// });

    // this.quillRef.keyboard.addBinding({ key: Keyboard.keys.BACKSPACE }, {
    //   collapsed: true,
    //   format: ['hidden-diy'],
    //   offset: 0
    // }, function (range, context) {
    //   console.log(context.format)
    //   // if (context.format.list) {
    //   //   this.quillRef.format('list', false);
    //   // } else {
    //   //   this.quillRef.format('blockquote', false);
    //   // }
    // });

class MyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    // this.formats = ['italic', 'underline'] // default formats
    this.handleChange = this.handleChange.bind(this)
    this.quillRef = null;
    this.reactQuillRef = null; // ReactQuill component
    window.insertText = this.insertText
    window.insertVideo = this.insertVideo

  }
  componentDidMount() {
    this.attachQuillRefs()
    // this.quillRef.keyboard.addBinding({ key: Keyboard.keys.BACKSPACE }, {
    //   collapsed: true,
    //   format: ['hidden-diy'],
    //   offset: 0
    // }, function (range, context) {
    //   console.log(context.format)
    //   // if (context.format.list) {
    //   //   this.quillRef.format('list', false);
    //   // } else {
    //   //   this.quillRef.format('blockquote', false);
    //   // }
    // });
  }
  componentDidUpdate() {
    // console.log('componentDidUpdate')
    this.attachQuillRefs()
  }
  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  }

  insertHidden = () => {
    // 得到当前焦点
    let range = this.quillRef.getSelection(true);
    // 获取当前有那些样式
    let format = this.quillRef.getFormat(...range);
    // console.log(format)
    this.quillRef.format('hidden-diy', true);
    // 几种 bullet ordered unchecked checked false
    // if (format.list) {
    //   this.quillRef.format('list', false);
    // } else {
    //   this.quillRef.format('list', 'bullet');
    // }
  }

  insertHr = () =>{
    console.log('insertHr');
    let range = this.quillRef.getSelection(true);
    // user
    // this.quillRef.insertText(range.index, '\n', Quill.sources.USER);
    this.quillRef.insertEmbed(range.index, 'Hrblock', Quill.sources.USER);
    this.quillRef.setSelection(range.index + 2, Quill.sources.USER);
  }

  insertList = () =>{
    // 得到当前焦点
    let range = this.quillRef.getSelection(true);
    // 获取当前有那些样式
    let format = this.quillRef.getFormat(...range);
    console.log(format)
    // 几种 bullet ordered unchecked checked false
    if (format.list) {
      this.quillRef.format('list', false);
    } else {
      this.quillRef.format('list', 'bullet');
    }
  }

  insertScroll=()=>{
    this.quillRef.format('scroll', true);
    
  }

  insertVideo = () => {
    this.reactQuillRef.getEditor().insertEmbed(0, 'image', 'http://p1.qhimgs4.com/t012c5eb9785a974f5e.webp');
    // let range = this.quillRef.getSelection(true);
    // let url = 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0';
    // this.quillRef.insertText(range.index, '\n', Quill.sources.USER);
    // this.quillRef.insertEmbed(range.index + 1, 'insertVideo', url, Quill.sources.USER);
    // this.quillRef.formatText(range.index + 1, 1, { height: '170', width: '400' });
    // this.quillRef.setSelection(range.index + 2, Quill.sources.SILENT);
  }
  insertImg = () => {
    // 得到当前焦点
    let range = this.quillRef.getSelection(true);
    // user
    console.log(range)
    // this.quillRef.insertText(range.index, '\n', Quill.sources.USER);
    this.quillRef.insertEmbed(range.index, 'image-diy', {
      alt: 'Quill Cloud',
      url: 'http://p2.qhimgs4.com/dmfd/95_60_/t0190d1166dd7e68103.jpg'
    });
    this.quillRef.setSelection(range.index + 1, Quill.sources.USER);
  }
  setConent = () => {
    let json = '{"ops":[{"insert":"1\na"},{"attributes":{"hidden-diy":true},"insert":"\n"},{"insert":"2"},{"attributes":{"hidden-diy":true},"insert":"\n"},{"insert":"111\n"}]}'
    console.log(json)
    let testData = JSON.parse(json.replace(/\n+/g,'\\n'));
    console.log(testData)
    this.quillRef.setContents(testData.ops)
    // this.quillRef.setContents([
    //   { insert: 'Hello ' },
    //   {
    //     // An image link
    //     insert: {
    //       image: 'http://p1.qhimgs4.com/dmfd/182_136_/t0111ae1c0806b67ed3.jpg'
    //     },
    //     attributes: {
    //       link: 'https://quilljs.com'
    //     }
    //   },
    //   { insert: 'World!', attributes: { bold: true } },
    //   { insert: '\n' }
    // ]);
  }
  insertLink = () => {
    // 得到当前焦点
    let range = this.quillRef.getSelection(true);
    console.log(range)
    // 输入要插入的文字
    // let value = prompt('Enter link URL');
    let value = '这是一个地址'
    // 先固定一个地址
    let url = 'http://www.baidu.com'
    // 插入文字
    this.quillRef.insertText(range.index, value);
    // 文字插入地址
    console.log(value.length)
    this.quillRef.formatText(range.index, value.length, { 'link-diy': true, 'href': url });
    // this.quillRef.formatLine(range.index, value.length, 'link-diy', url);
  }

  insertText = (boolean = true) => {
    // 得到当前焦点
    let range = this.quillRef.getSelection(true);
    // 获取当前有那些样式
    let format = this.quillRef.getFormat(...range);
    console.log(range, format)
    this.quillRef.insertText(0, 'Test', { 'bold-diy': true });
    this.quillRef.formatText(0, 4, 'italic-diy', true);
    this.quillRef.formatText(0, 4, 'strike-diy', true);
    // const cursorPosition = this.quill.getSelection().index
    // this.quill.insertText(cursorPosition, "★")
    // this.quill.setSelection(cursorPosition + 1)

    // this.quillRef.insertText(0, 'Test', { bold: true });
    // this.quillRef.formatText(0, 4, 'bold', true); let range = quill.getSelection(true);
    // this.quillRef.undo() ???
    // this.quill.format('hidden-block', boolean);

    // let range = this.quillRef.getSelection(true);
    // console.log(Quill.sources.USER)
    // this.quillRef.insertText(range.index, '\n', Quill.sources.USER);
    // this.quillRef.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    // this.quillRef.setSelection(range.index + 2, Quill.sources.SILENT);
    // var range = this.quillRef.getSelection();
    // console.log(range)
    // this.quillRef.setContents([
    //       { insert: 'Hello ' },
    //       { insert: 'World!', attributes: { bold: true } },
    //       { insert: '\n' }
    // ]);
    // 内联媒体
    // this.quillRef.insertEmbed(range.index, 'image', 'http://p1.qhimgs4.com/dmfd/158_88_/t0171ea6adfcc333ffc.jpg?size=297x300');
    // let position = range ? range.index : 0;
    // this.quillRef.insertText(position, 'Hello, World! ')
    // this.quillRef.formatText(range.index, range.length, 'bold', true);
    // let {bold} = this.quillRef.getFormat();
    // this.quillRef.formatText(...Object.values(range),{
    //   'bold': !bold
    // });
    // 判断当前有哪些样式
    // var sty = this.quillRef.getFormat();
    // console.log(sty);
    // 插入链接
    // this.quillRef.insertText(position, 'Hello', 'link', 'https://world.com');
  }
  handleChange(content, delta, source, editor) {
    // content 是真实的渲染DOM
    // delta 记录了修改的对象，下篇文章详述
    // source 值为user或api
    // editor 文本框对象，可以调用函数获取content, delta值
    // console.log(arguments)
    // console.log(delta)
    // console.log(editor.getContents())
    // console.log(JSON.stringify(editor.getContents()))
    
    this.setState({ text: content })
    // console.log(this)
  }

  tidyHtml(source) {
    // return source
    return pretty(source);
  }

  onChangeSelection(range, source, editor){
    // 用新的选定范围返回，或在未聚焦时返回null。它将被传递给选择范围，更改的来源，并最终传递给编辑器访问器的只读代理getBounds()。
    console.warn('onChangeSelection')
  }
  onFocus(range, source, editor){
    // 当编辑器聚焦时调用。它将收到新的选择范围。
    console.warn('onFocus')
  }
  onBlur(previousRange, source, editor){
    // 当编辑失去焦点时调用。它会在失去焦点之前收到它所选择的选择范围。
    console.warn('onBlur')
  }
  render() {
    return (
      <div>
        <ReactQuill
          modules={
            {
              'toolbar': toolbarOptions,
              'keyboard': {
                bindings: bindings
              },
              counter: {
                container: '#counter',
                unit: 'word'
              }
            }
          }
          // formats={this.formats} // the custom format is already registered
          ref={(el) => { this.reactQuillRef = el }}
          value={this.state.text}
          onChange={this.handleChange}
          onChangeSelection={this.onChangeSelection}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        // clipboard={
        //   { matchVisual: false }
        // }
        >
        </ReactQuill>
        <button onMouseDown={() => this.insertText()}>insertText</button>
        <button onClick={() => this.insertVideo()}>insertVideo</button>
        <button onClick={() => this.insertHidden()}>insertHidden</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.insertHr() }}>insertHr</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.insertLink() }}>insertLink</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.insertImg() }}>insertImg</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.setConent() }}>setConent</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.insertList() }}>insertList</button>
        <button onMouseDown={(e) => { e.preventDefault(), this.insertScroll() }}>insertScroll</button>
        <pre>
          {this.tidyHtml(this.state.text)}
        </pre>
      </div>
    )
  }
}

export default MyComponent