import { Quill } from 'react-quill';
let Block = Quill.import('formats/code-block');


class Blockquote extends Block { }
Blockquote.blotName = 'hidden-block1';
// Blockquote.tagName = 'CODE';
// Blockquote.className = 'hidden-block';


export default Blockquote;