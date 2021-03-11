import AceEditor from 'react-ace'
import React, { useEffect, useState } from 'react'
import Beautify from 'ace-builds/src-noconflict/ext-beautify'
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite'
import 'ace-builds/src-noconflict/ext-error_marker'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/mode-java' //npm i -D @types/ace-builds
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-xcode'
import queryString from 'query-string'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/mode-php'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/mode-powershell'
import 'ace-builds/src-noconflict/snippets/c_cpp'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/php'
import io from 'socket.io-client'
import './Editor.css'

const client = io.connect('http://localhost:8080') // import './App.css'
//const client = new W3CWebSocket('ws://127.0.0.1:8000')

const Editor = ({ location }) => {
  const room = queryString.parse(location.search)
  console.log(room)
  const [state, setState] = useState({
    text: '',
    langauge: '54',
    theme: 'terminal',
    input: '',
    output: '',
  })
  //const [text, setText] = useState('')
  useEffect(() => {
    client.emit('join', room.id)
    // const data = { room: room.id, data: state }
    // console.log('own-data', data)
    // client.emit('data', data)
  }, [])
  useEffect(() => {
    console.log('here')
    client.on('data', (newState) => {
      console.log('data', newState)
      console.log('incoming-text', newState.data.data)
      if (newState.data.data.text !== ' ') setState(newState.data.data)
    })
  })
  const handleChange = (text) => {
    console.log('text', text)
    //const editorInput = text
    const newState = {
      text: text,
      langauge: state.langauge,
      theme: state.theme,
      input: state.input,
      output: state.output,
    }

    console.log('state', state)
    const data = { room: room.id, data: newState }
    //console.log('data', data)
    // console.log('own-data', data)
    client.emit('data', data)
    setState(newState)
  }
  const handleLanguageChange = (langauge) => {
    const newState = {
      text: state.text,
      langauge: langauge,
      theme: state.theme,
      input: state.input,
      output: state.output,
    }
    setState(newState)

    console.log('state', state)
    const data = { room: room.id, data: newState }
    //console.log('data', data)
    // console.log('own-data', data)
    client.emit('data', data)
  }
  const handleThemeChange = (theme) => {
    const newState = {
      text: state.text,
      langauge: state.langauge,
      theme: theme,
      input: state.input,
      output: state.output,
    }
    setState(newState)

    console.log('state', state)
    const data = { room: room.id, data: newState }
    //console.log('data', data)
    // console.log('own-data', data)
    client.emit('data', data)
  }
  const handleUserInput = (input) => {
    const newState = {
      text: state.text,
      langauge: state.langauge,
      theme: state.theme,
      input: input,
      output: state.output,
    }
    setState(newState)

    console.log('state', state)
    const data = { room: room.id, data: newState }
    //console.log('data', data)
    // console.log('own-data', data)
    client.emit('data', data)
  }
  const handleCodeOutput = (output) => {
    const newState = {
      text: state.text,
      langauge: state.langauge,
      theme: state.theme,
      input: state.input,
      output: output,
    }
    setState(newState)

    console.log('state', state)
    const data = { room: room.id, data: newState }
    //console.log('data', data)
    // console.log('own-data', data)
    client.emit('data', data)
  }

  onsubmit = async (e) => {
    console.log('state', state)
    e.preventDefault()
    let outputText = document.getElementById('output1')
    outputText.value = ''
    outputText.value += 'Creating Submission ...\n'
    handleCodeOutput(outputText.value)
    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key':
            'ceb7f56f31msh830547702c628b7p142b50jsn88f1d5083ecf', //// Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          source_code: state.text,
          stdin: state.input,
          language_id: parseInt(state.langauge),
        }),
      }
    )
    const body = {
      source_code: state.text,
      stdin: state.input,
      language_id: state.langauge,
    }
    console.log('body', body)
    outputText.value += 'Submission Created ...\n'
    handleCodeOutput(outputText.value)
    // state.output = outputText.value
    // setState(state)
    const jsonResponse = await response.json()
    console.log('json-response', jsonResponse)

    let jsonGetSolution = {
      status: { description: 'Queue' },
      stderr: null,
      compile_output: null,
    }

    while (
      jsonGetSolution.status.description !== 'Accepted' &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`
      handleCodeOutput(outputText.value)
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`

        const getSolution = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key':
              'ceb7f56f31msh830547702c628b7p142b50jsn88f1d5083ecf', //// Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
            'content-type': 'application/json',
          },
        })

        jsonGetSolution = await getSolution.json()
        console.log(jsonGetSolution)
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout)

      outputText.value = ''

      outputText.value += `Results : ${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
      handleCodeOutput(outputText.value)
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr)
      console.log(error)
      outputText.value = ''

      outputText.value += `\n Error :${error}`
      handleCodeOutput(outputText.value)
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output)
      console.log(compilation_error)
      outputText.value = ''
      outputText.value += `\n Error :${compilation_error}`
      console.log(outputText.value)
      handleCodeOutput(outputText.value)
    }
  }

  let map1 = new Map()

  map1.set(54, 'c_cpp')
  map1.set(71, 'python')
  map1.set(62, 'java') // a string key
  map1.set(60, 'golang')
  map1.set(63, 'javascript')
  map1.set(68, 'php')
  return (
    <div className='compiler'>
      <AceEditor
        mode={map1.get(parseInt(state.langauge))}
        theme={state.theme}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          behavioursEnabled: true,

          displayIndentGuides: true, // boolean: true if the indent should be shown. See 'showInvisibles'
          showInvisibles: true, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
        }}
        className='editor'
        highlightActiveLine={true}
        // options={{
        //   placeholder: {
        //     text: state.text ? contentDefaultMessage : '',
        //   },
        // }}
        commands={[
          Beautify.commands,
          {
            // commands is array of key bindings.
            name: 'removeline', //name for the key binding.
            bindKey: { win: 'Ctrl-X', mac: 'Command-X' }, //key combination used for the command.
            exec: 'removeline', // name of the command to rebind
          },
          {
            // commands is array of key bindings.
            name: 'copyline', //name for the key binding.
            bindKey: { win: 'Ctrl-C', mac: 'Command-C' }, //key combination used for the command.
            exec: 'copyline', // name of the command to rebind
          },
          {
            // commands is array of key bindings.
            name: 'copyline', //name for the key binding.
            bindKey: { win: 'Ctrl-C', mac: 'Command-C' }, //key combination used for the command.
            exec: 'copyline', // name of the command to rebind
          },
          {
            // commands is array of key bindings.
            name: 'format', //name for the key binding.
            bindKey: { win: 'Ctrl-Shift-b', mac: 'Command-Shift-b' }, //key combination used for the command.
            exec: 'beautify', // name of the command to rebind
          },
        ]}
        fontSize='15px'
        name='UNIQUE_ID_OF_DIV'
        editorProps={{ $blockScrolling: false }}
        style={{
          height: 700,
          width: 800,
          display: 'flex',
          justifyContent: 'center',
          font: 50,
          whiteSpace: 'pre-wrap',
        }}
        value={state.text}
        onChange={handleChange}
      />
      <div>
        <select
          onChange={(e) => handleLanguageChange(e.target.value)}
          className='langauges'
          value={state.langauge}
        >
          <option value='54'>C++</option>
          <option value='71'>python</option>
          <option value='62'>java</option>
          <option value='60'>golang</option>
          <option value='63'>javascript</option>
          <option value='68'>PHP</option>
        </select>
        <select
          onChange={(e) => handleThemeChange(e.target.value)}
          className='themes'
          value={state.theme}
        >
          <option value='terminal'>terminal</option>
          <option value='monokai'>monokai</option>
          <option value='xcode'>xcode</option>
          <option value='github'>github</option>
          <option value='solarized_dark'>solarized_dark</option>
          <option value='tomorrow'>tomorrow</option>
        </select>
      </div>
      <div>
        <div className='mt-2 ml-5'>
          <span
            className='badge badge-primary heading my-2 '
            style={{ color: 'black' }}
          >
            <i className='fas fa-user fa-fw fa-md' style={{ color: 'black' }} />{' '}
            User Input
          </span>
          <br />
          <textarea
            value={state.input}
            id='input1'
            style={{ height: 150, width: 250, marginTop: 25 }}
            onChange={(e) => handleUserInput(e.target.value)}
          />
        </div>
        <div className='mt-2 ml-5'>
          <span
            className='badge badge-primary heading my-2'
            style={{ color: 'black' }}
          >
            <i className='fas fa-user fa-fw fa-md'> Output</i>
          </span>
          <br />
          <textarea
            value={state.output}
            id='output1'
            style={{ height: 330, width: 438, marginTop: 25 }}
            onChange={(e) => handleCodeOutput(e.target.value)}
          />
        </div>
      </div>
      <button
        style={{ height: 50, width: 100, marginRight: 100, marginTop: 25 }}
        type='submit'
        className='btn'
        onClick={(e) => onsubmit(e)}
      >
        Submit
      </button>
    </div>
  )
}

export default Editor
