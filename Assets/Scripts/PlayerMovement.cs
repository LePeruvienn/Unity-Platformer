using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerMovement : MonoBehaviour
{
	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;

	// Player States
	private bool _isRunning = false;
	private bool _isJumpRequested = false;

	// Player movement input
	Vector2 _moveInput = Vector2.zero;


	// Player movement config
	public float jumpForce = 5f;
	public float moveSpeed = 5f;
	public float runSpeed = 8f;

	/*
	 * Start Method used to get Player's Components
	 */
	void Start()
	{
		// Get Rigidbody2D & Animator from Player game object
		_rigidbody = GetComponent<Rigidbody2D>();
		_animator = GetComponent<Animator>();
	}

	/*
	 * Handle Player movement behaviour
	 */
	void FixedUpdate()
	{
		// Get current Rigidbody velocity
		Vector2 velocity = _rigidbody.velocity;

		// Add velocity is player depening of player input & state
		velocity.x = _moveInput.x * (_isRunning ? runSpeed : moveSpeed);

		// If player is trying to jump
		if (_isJumpRequested) {

			// Add jumpForce to y velocity
			velocity.y = jumpForce;
			// Now player dont want to jump
			_isJumpRequested = false;
		}

		// Set new velocity to player Rigidbody
		_rigidbody.velocity = velocity;
	}

	/*
	 * Used to update player direction input values
	 */
	void OnMove(InputValue value) {

		_moveInput = value.Get<Vector2>();
	}

	/*
	 * Update request jump status
	 */
	void OnJump() {
		_isJumpRequested = true;
	}

	/*
	 * Handle player isRunning state
	 */
	void OnRun(InputValue value) {

		// Get pressing value
		float pressing = value.Get<float>();

		// If Player is pressing is set isRunning to true
		_isRunning = pressing >= 0.5f;
	}
}
