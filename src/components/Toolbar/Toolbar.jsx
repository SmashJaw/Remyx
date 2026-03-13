import React, { useMemo } from 'react'
import { ToolbarButton } from './ToolbarButton.jsx'
import { ToolbarDropdown } from './ToolbarDropdown.jsx'
import { ToolbarColorPicker } from './ToolbarColorPicker.jsx'
import { ToolbarSeparator } from './ToolbarSeparator.jsx'
import { DEFAULT_TOOLBAR, DEFAULT_FONTS, DEFAULT_FONT_SIZES, HEADING_OPTIONS } from '../../constants/defaults.js'
import { isMac } from '../../utils/platform.js'

const BUTTON_COMMANDS = new Set([
  'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
  'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
  'orderedList', 'unorderedList', 'taskList',
  'blockquote', 'codeBlock', 'horizontalRule',
  'undo', 'redo', 'removeFormat',
  'indent', 'outdent',
  'fullscreen', 'sourceMode', 'toggleMarkdown',
])

const TOOLTIP_MAP = {
  bold: 'Bold', italic: 'Italic', underline: 'Underline', strikethrough: 'Strikethrough',
  subscript: 'Subscript', superscript: 'Superscript',
  alignLeft: 'Align Left', alignCenter: 'Align Center', alignRight: 'Align Right', alignJustify: 'Justify',
  orderedList: 'Numbered List', unorderedList: 'Bulleted List', taskList: 'Task List',
  blockquote: 'Blockquote', codeBlock: 'Code Block', horizontalRule: 'Horizontal Rule',
  undo: 'Undo', redo: 'Redo', removeFormat: 'Remove Formatting',
  indent: 'Indent', outdent: 'Outdent',
  link: 'Insert Link', image: 'Insert Image', attachment: 'Attach File', table: 'Insert Table',
  importDocument: 'Import Document',
  embedMedia: 'Embed Media', findReplace: 'Find & Replace',
  fullscreen: 'Fullscreen', sourceMode: 'Source Code',
  toggleMarkdown: 'Toggle Markdown', export: 'Export Document',
}

const SHORTCUT_MAP = {
  bold: 'mod+B', italic: 'mod+I', underline: 'mod+U',
  strikethrough: 'mod+Shift+X', undo: 'mod+Z', redo: 'mod+Shift+Z',
  insertLink: 'mod+K', findReplace: 'mod+F',
  fullscreen: 'mod+Shift+F', sourceMode: 'mod+Shift+U',
}

function getShortcutLabel(command) {
  const shortcut = SHORTCUT_MAP[command]
  if (!shortcut) return ''
  return shortcut.replace(/mod/g, isMac() ? '⌘' : 'Ctrl')
}

export function Toolbar({ config, engine, selectionState, onOpenModal, fonts = DEFAULT_FONTS, wordCountButton, toolbarItemTheme }) {
  const toolbarConfig = config || DEFAULT_TOOLBAR

  const items = useMemo(() => {
    const result = []
    toolbarConfig.forEach((group, gi) => {
      if (gi > 0) result.push({ type: 'separator', key: `sep-${gi}` })

      const groupItems = Array.isArray(group) ? group : [group]
      groupItems.forEach((item) => {
        if (item === '|') {
          result.push({ type: 'separator', key: `sep-${gi}-inline` })
        } else if (typeof item === 'string') {
          result.push({ type: 'item', command: item, key: item })
        } else {
          result.push({ type: 'custom', ...item, key: item.command || item.name })
        }
      })
    })
    return result
  }, [toolbarConfig])

  if (!engine) return null

  const renderItem = (item) => {
    if (item.type === 'separator') {
      return <ToolbarSeparator key={item.key} separatorStyle={toolbarItemTheme?._separator} />
    }

    const { command } = item
    const itemStyle = toolbarItemTheme?.[command] || null

    // Dropdown items
    if (command === 'headings') {
      const current = selectionState.heading || 'p'
      return (
        <ToolbarDropdown
          key={command}
          label="Normal"
          value={current}
          options={HEADING_OPTIONS.map(o => ({
            ...o,
            style: o.tag !== 'p' ? { fontSize: `${22 - (parseInt(o.tag?.[1]) || 0) * 2}px`, fontWeight: 'bold' } : {},
          }))}
          onChange={(value) => engine.executeCommand('heading', value === 'p' ? 'p' : value.replace('h', ''))}
          tooltip="Block Type"
          width={130}
          itemStyle={itemStyle}
        />
      )
    }

    if (command === 'fontFamily') {
      const current = selectionState.fontFamily?.replace(/['"]/g, '') || ''
      return (
        <ToolbarDropdown
          key={command}
          label="Font"
          value={current}
          options={fonts.map((f) => ({ label: f, value: f, style: { fontFamily: f } }))}
          onChange={(value) => engine.executeCommand('fontFamily', value)}
          tooltip="Font Family"
          width={140}
          itemStyle={itemStyle}
        />
      )
    }

    if (command === 'fontSize') {
      return (
        <ToolbarDropdown
          key={command}
          label="Size"
          value={selectionState.fontSize || ''}
          options={DEFAULT_FONT_SIZES}
          onChange={(value) => engine.executeCommand('fontSize', value)}
          tooltip="Font Size"
          width={80}
          itemStyle={itemStyle}
        />
      )
    }

    // Color pickers
    if (command === 'foreColor') {
      return (
        <ToolbarColorPicker
          key={command}
          command="foreColor"
          tooltip="Text Color"
          currentColor={selectionState.foreColor}
          onColorSelect={(color) => engine.executeCommand('foreColor', color)}
          itemStyle={itemStyle}
        />
      )
    }

    if (command === 'backColor') {
      return (
        <ToolbarColorPicker
          key={command}
          command="backColor"
          tooltip="Background Color"
          currentColor={selectionState.backColor}
          onColorSelect={(color) => engine.executeCommand('backColor', color)}
          itemStyle={itemStyle}
        />
      )
    }

    // Modal triggers
    if (command === 'link') {
      return (
        <ToolbarButton
          key={command}
          command={command}
          tooltip={TOOLTIP_MAP[command]}
          active={!!selectionState.link}
          onClick={() => {
            if (selectionState.link) {
              onOpenModal?.('link', selectionState.link)
            } else {
              onOpenModal?.('link', { text: engine.selection.getSelectedText() })
            }
          }}
          shortcutLabel={getShortcutLabel('insertLink')}
          itemStyle={itemStyle}
        />
      )
    }

    if (command === 'image') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('image')} itemStyle={itemStyle} />
      )
    }

    if (command === 'attachment') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('attachment')} itemStyle={itemStyle} />
      )
    }

    if (command === 'importDocument') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('importDocument')} itemStyle={itemStyle} />
      )
    }

    if (command === 'table') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('table')} itemStyle={itemStyle} />
      )
    }

    if (command === 'embedMedia') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('embed')} itemStyle={itemStyle} />
      )
    }

    if (command === 'findReplace') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('findReplace')}
          shortcutLabel={getShortcutLabel(command)} itemStyle={itemStyle} />
      )
    }

    if (command === 'export') {
      return (
        <ToolbarButton key={command} command={command} tooltip={TOOLTIP_MAP[command]}
          onClick={() => onOpenModal?.('export')} itemStyle={itemStyle} />
      )
    }

    // Regular button commands
    if (BUTTON_COMMANDS.has(command)) {
      const isActive = command === 'bold' ? selectionState.bold
        : command === 'italic' ? selectionState.italic
        : command === 'underline' ? selectionState.underline
        : command === 'strikethrough' ? selectionState.strikethrough
        : command === 'subscript' ? selectionState.subscript
        : command === 'superscript' ? selectionState.superscript
        : command === 'alignLeft' ? selectionState.alignment === 'left'
        : command === 'alignCenter' ? selectionState.alignment === 'center'
        : command === 'alignRight' ? selectionState.alignment === 'right'
        : command === 'alignJustify' ? selectionState.alignment === 'justify'
        : command === 'orderedList' ? selectionState.orderedList
        : command === 'unorderedList' ? selectionState.unorderedList
        : command === 'blockquote' ? selectionState.blockquote
        : command === 'codeBlock' ? selectionState.codeBlock
        : command === 'sourceMode' ? engine.isSourceMode
        : command === 'toggleMarkdown' ? engine.isMarkdownMode
        : command === 'fullscreen' ? engine.element?.closest('.rmx-editor')?.classList.contains('rmx-fullscreen')
        : false

      return (
        <ToolbarButton
          key={command}
          command={command}
          tooltip={TOOLTIP_MAP[command] || command}
          active={isActive}
          onClick={() => engine.executeCommand(command)}
          shortcutLabel={getShortcutLabel(command)}
          itemStyle={itemStyle}
        />
      )
    }

    // Fallback
    return (
      <ToolbarButton
        key={command}
        command={command}
        tooltip={TOOLTIP_MAP[command] || command}
        onClick={() => engine.executeCommand(command)}
        itemStyle={itemStyle}
      />
    )
  }

  return (
    <div className="rmx-toolbar" role="toolbar" aria-label="Editor toolbar">
      <div className="rmx-toolbar-inner">
        {items.map(renderItem)}
        {wordCountButton && (
          <>
            <ToolbarSeparator />
            {wordCountButton}
          </>
        )}
      </div>
    </div>
  )
}
