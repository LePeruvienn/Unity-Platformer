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
	private bool _isJumping = false;
	private bool _isInAir = false;

	// Player movement input
	Vector2 _moveInput = Vector2.zero;

	// Ground check system
	[Header("Ground checker System")]
	[SerializeField] private Transform groundCheckerOrigin;
	[SerializeField] private Vector2 groundCheckerBoxSize = new Vector2(0.5f, 0.1f);
	[SerializeField] private LayerMask groundLayer;

	// Player movement config
	[Header("Movement values")]
	[SerializeField] private float jumpForce = 5f;
	[SerializeField] private float moveSpeed = 5f;
	[SerializeField] private float runSpeed = 8f;

	/*
	 * Start Method used to get Player's Components
	 * @memberOf : UnityEngine
	 */
	void Start() {
		// Get Rigidbody2D & Animator from Player game object
		_rigidbody = GetComponent<Rigidbody2D>();
		_animator = GetComponent<Animator>();
	}

	/*
	 * Handle Player movement behaviour
	 * @memberOf : UnityEngine
	 */
	void FixedUpdate() {

		// Get current Rigidbody velocity
		Vector2 velocity = _rigidbody.velocity;

		// Add velocity is player depening of player input & state
		velocity.x = _moveInput.x * (_isRunning ? runSpeed : moveSpeed);

		// If player is trying to jump
		if (_isJumping && !_isInAir) {
			// Add jumpForce to y velocity
			velocity.y = jumpForce;
			// Set player in Air
			_isInAir = true;
		}

		// If player is inAir, check if he is grounded
		if (_isInAir && isGrounded())
			// If he is reset _isInAir
			_isInAir = false;

		// Set new velocity to player Rigidbody
		_rigidbody.velocity = velocity;
	}

	/*
	 * Used to update player direction input values
	 * @memberOf : InputSystem.Event
	 */
	void OnMove(InputValue value) {

		_moveInput = value.Get<Vector2>();
	}

	/*
	 * Update request jump status
	 * @memberOf : InputSystem.Event
	 */
	void OnJump() {
		_isJumping = true;
	}

	/*
	 * Handle player isRunning state
	 * @memberOf : InputSystem.Event
	 */
	void OnRun(InputValue value) {

		// Get pressing value
		float pressing = value.Get<float>();

		// If Player is pressing is set isRunning to true
		_isRunning = pressing >= 0.5f;
	}
	
	/*
	 * Check if te player is on the ground
	 * @memberOf : PlayerMovement
	 */
	bool isGrounded() {
		
		// Run a BoxCast to see if we are colliding with the ground
		return Physics2D.BoxCast(
			groundCheckerOrigin.position, // Cast origin
			groundCheckerBoxSize,         // size of the box
			0f,                           // rotation
			Vector2.down,                 // cast direction
			0f,                           // cast distance
			groundLayer                   // layer mask detection
		);
	}


	/*
	 * Used to draw collisions & cast on scene
	 * @memberOf : Debug 🤓
	 */
	void OnDrawGizmosSelected() {
	
		Gizmos.color = Color.red;

		// Draw groundChecker box
		Gizmos.DrawWireCube(groundCheckerOrigin.position, groundCheckerBoxSize);
	}
}
