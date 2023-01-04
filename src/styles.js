export const styles = /*css*/`
:host {
	--text-color: #333;
	--frame-color: #ddd;
	--frame-highlight-color: #bbb;
}
/* content */
table {
	table-layout: fixed;
	width: 100%;
	white-space: nowrap;
	border-collapse: collapse;
	border-spacing: 0;
	border: 3px solid var(--frame-color);
	color: var(--text-color);
}
th {
	position: relative;
	background-color: var(--frame-color);
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 1rem;
}
th svg {
	position: absolute;
	right: 1rem;
	top: 0.5rem;
}
th svg polygon {
	fill: var(--text-color);
}
tr {
	border: 1px solid var(--frame-color);
}
tr.odd {
	background-color: #fafafa;
}
tr.even {
	background-color: white;
}
tr:hover {
	background-color: #e8e8e8;
}
td {
	overflow: hidden;
	border: 1px solid var(--frame-color);
	padding: 0.2rem;
	margin: 0;
}
/* footer */
footer {
	display: flex;
	background-color: var(--frame-color);
	align-items: center;
	color: var(--text-color);
	padding: 0.4rem;
	margin: 0;
}
footer :is(.button, button) {
	color: var(--text-color);
	text-decoration: none;
	background-color: #f7f7f7;
	cursor: pointer;
}
footer :is(.button:hover, button:hover) {
	background-color: #eee;
}
footer input {
	margin: 0 0.5rem;
	vertical-align: middle;
	border-radius: 2px;
	border: 1px solid var(--frame-highlight-color);
}
.buttons {
	flex-grow: 2;
}
.buttons .button {
	border: 1px solid var(--frame-highlight-color);
	border-radius: 2px;
	padding: 0 0.5rem;
}
.controls {
	border: 1px solid var(--frame-highlight-color);
	border-radius: 2px;
	margin: 0 0.5rem;
}
.controls button {
	border: 0;
	border-right: 1px solid var(--frame-highlight-color);
	height: 1.5rem;
	padding: 0.3rem;
}
.controls button[disabled] {
	opacity: 0.1;
	cursor: auto;
}
.controls button:last-child {
	border-right: none;
}
.controls button svg :is(polygon,rect) {
	fill: var(--text-color);
}
`;
