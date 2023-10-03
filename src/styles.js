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

	& svg {
		position: absolute;
		right: 1rem;
		top: 0.5rem;

		& polygon {
			fill: var(--text-color);
		}
	}
}
tr {
	border: 1px solid var(--frame-color);

	&.odd {
		background-color: #fafafa;
	}
	&.even {
		background-color: white;
	}
	&:hover {
		background-color: #e8e8e8;
	}
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

	:is(.button, button) {
		color: var(--text-color);
		text-decoration: none;
		background-color: #f7f7f7;
		cursor: pointer;

		&:hover {
			background-color: #eee;
		}
	}
	& input {
		margin: 0 0.5rem;
		vertical-align: middle;
		border-radius: 2px;
		border: 1px solid var(--frame-highlight-color);
	}
}
.buttons {
	flex-grow: 2;

	.button {
		border: 1px solid var(--frame-highlight-color);
		border-radius: 2px;
		padding: 0 0.5rem;
	}
}
.controls {
	margin: 0 0.5rem;

	& button {
		border-color: var(--frame-highlight-color);
		border-style: solid;
		border-width: 1px 0 1px 1px;

		&[disabled] {
			opacity: 0.1;
			cursor: auto;
		}
		&:first-child {
			border-radius: 2px 0 0 2px;
		}
		&:last-child {
			border-radius: 0 2px 2px 0;
			border-right-width: 1px;
		}
		& svg {
			width: 1rem;
			height: 1rem;
			vertical-align: bottom;
			margin: 0.2rem 0.4rem;

			:is(polygon,rect) {
				fill: var(--text-color);
			}
		}
	}
}
`;
