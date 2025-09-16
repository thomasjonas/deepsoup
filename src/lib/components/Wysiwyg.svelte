<script lang="ts">
	import {
		Divider,
		FormatButton,
		InvisibleButtonGroup,
		ListButtonGroup,
		TextEditor,
		ToolbarRowWrapper,
		UndoRedoButtonGroup
	} from '@flowbite-svelte-plugins/texteditor';
	import type { Editor } from '@tiptap/core';

	let { value = $bindable() } = $props();

	let editor = $state<Editor | null>(null);
	let isEditable = $state(true);

	function getEditorContent() {
		return editor?.getHTML() ?? '';
	}

	function handleTransaction(t: any) {
		value = getEditorContent();
	}

	$effect(() => {
		editor?.on('transaction', handleTransaction);
		return () => {
			editor?.off('transaction', handleTransaction);
		};
	});
</script>

<TextEditor bind:editor content={value} {isEditable} class="wysiwyg-container">
	<ToolbarRowWrapper>
		<FormatButton {editor} format="link" />
		<FormatButton {editor} format="removeLink" />
		<Divider />
		<ListButtonGroup {editor} />
		<Divider />
		<UndoRedoButtonGroup {editor} />
		<Divider />
		<InvisibleButtonGroup {editor} hide={false} show={false} />
	</ToolbarRowWrapper>
</TextEditor>
