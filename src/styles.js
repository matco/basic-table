export const styles = /*css*/`
:host {
	--text-color: #333;
	--border-color: #eee;
}
/* header */
.table_header {
	color: var(--text-color);
	margin-bottom: 0.2rem;
}
/* content */
.table_content {
	table-layout: fixed;
	width: 100%;
	white-space: nowrap;
	border-collapse: collapse;
	border-spacing: 0;
	border: 1px solid var(--border-color);
	color: var(--text-color);
}
.table_content th {
	position: relative;
	background-color: #ddd;
	border: 1px solid var(--border-color);
	border-top: 0;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 1rem;
}
.table_content th svg {
	position: absolute;
	right: 1rem;
	top: 0.5rem;
}
.table_content th svg polygon {
	fill: var(--text-color);
}
.table_content tr {
	border: 1px solid var(--border-color);
}
.table_content tr.odd {
	background-color: #fafafa;
}
.table_content tr.even {
	background-color: white;
}
.table_content tr:hover {
	background-color: #e8e8e8;
}
.table_content td {
	overflow: hidden;
	border: 1px solid var(--border-color);
	padding: 0.2rem;
	margin: 0;
}
/* footer */
.table_footer {
	display: flex;
	background-color: #ddd;
	align-items: center;
	color: var(--text-color);
	border: 1px solid var(--border-color);
	border-top: 0;
	padding: 0.4rem;
	margin: 0;
}
.table_footer :is(.button, button) {
	color: var(--text-color);
	text-decoration: none;
	background-color: #f7f7f7;
	cursor: pointer;
}
.table_footer :is(.button:hover, button:hover) {
	background-color: #eee;
}
.table_footer_search input {
	margin: 0 0.5rem;
	vertical-align: middle;
	border-radius: 2px;
	border: 1px solid var(--border-color);
}
.table_footer_buttons {
	flex-grow: 2;
}
.table_footer_buttons .button {
	border: 1px solid var(--border-color);
	border-radius: 2px;
	padding: 0 0.5rem;
}
.table_footer_controls {
	border: 1px solid var(--border-color);
	border-radius: 2px;
	margin: 0 0.5rem;
}
.table_footer_controls button {
	border: 0;
	border-right: 1px solid var(--border-color);
	height: 1.5rem;
	padding: 0.3rem;
}
.table_footer_controls button[disabled] {
	opacity: 0.1;
	cursor: auto;
}
.table_footer_controls button:last-child {
	border-right: none;
}
.table_footer_controls button svg :is(polygon,rect) {
	fill: var(--text-color);
}
`;
