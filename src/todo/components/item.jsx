import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";
import "../app.css";
import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({
	todo,
	dispatch,
	index,
	visibleTodos,
}) {
	const [isWritable, setIsWritable] = useState(false);
	const { title, completed, id } = todo;

	const toggleItem = useCallback(
		() => dispatch({ type: TOGGLE_ITEM, payload: { id, time: new Date() } }),
		[dispatch]
	);
	const removeItem = useCallback(
		() => dispatch({ type: REMOVE_ITEM, payload: { id } }),
		[dispatch]
	);
	const updateItem = useCallback(
		(id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }),
		[dispatch]
	);

	const handleDoubleClick = useCallback(() => {
		setIsWritable(true);
	}, []);

	const handleBlur = useCallback(() => {
		setIsWritable(false);
	}, []);

	const handleUpdate = useCallback(
		(title) => {
			if (title.length === 0) removeItem(id);
			else updateItem(id, title);

			setIsWritable(false);
		},
		[id, removeItem, updateItem]
	);
	useEffect(() => {
		if (todo.fadeOut) {
			const timeout = setTimeout(() => {
				dispatch({
					type: "UPDATE_FADEOUT",
					payload: { id: todo.id, fadeOut: false },
				});
			}, 15000);

			return () => clearTimeout(timeout);
		}
	}, [dispatch, todo]);

	const [color, setColor] = useState("grey");

	useEffect(() => {
		if (todo.completed) {
			if (index === visibleTodos.length - 1)
				setColor("green"); // Last completed task
			else if (index === visibleTodos.length - 2)
				setColor("magenta"); // Second last completed task
			else if (index === visibleTodos.length - 3) setColor("yellow"); // Third last completed task
		}
	}, [todo.completed, index, visibleTodos]);

	return (
		<li
			className={classnames({ completed: todo.completed })}
			data-testid="todo-item"
		>
			<div className="view">
				{isWritable ? (
					<Input
						onSubmit={handleUpdate}
						label="Edit Todo Input"
						defaultValue={title}
						onBlur={handleBlur}
					/>
				) : (
					<>
						<input
							className="toggle"
							type="checkbox"
							data-testid="todo-item-toggle"
							checked={completed}
							onChange={toggleItem}
						/>
						<div>
							<label
								style={{ color: color }}
								className={todo.fadeOut ? "fadeOut" : ""}
								data-testid="todo-item-label"
								onDoubleClick={handleDoubleClick}
							>
								{title}
							</label>
						</div>
						<button
							className="destroy"
							data-testid="todo-item-button"
							onClick={removeItem}
						/>
					</>
				)}
			</div>
		</li>
	);
});
