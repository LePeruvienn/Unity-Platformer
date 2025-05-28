using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

/*
 * TODO:
 * - I Dont like the Jumping system cause we cant hold `JUMP` to make the player keep jumping
 * - ...
 */

public class PlayerMovement : MonoBehaviour
{
	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;
	private SpriteRenderer _spriteRenderer;

	// Player States
	private bool _isRunning = false;
	private bool _requestJump = false;
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
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();
	}

	/*
	 * Handle Player movement & animator behaviour
	 * @memberOf : UnityEngine
	 */
	void FixedUpdate() {
		// Needs to update movements first,
		// to be sures to have the correct status for handleAnimator ☝️🤓
		handleMovements();
		handleAnimator();
	}

	void handleMovements() {

		// Get current Rigidbody velocity
		Vector2 velocity = _rigidbody.velocity;

		// Add velocity is player depening of player input & state
		velocity.x = _moveInput.x * (_isRunning && !_isJumping ? runSpeed : moveSpeed);

		// Check if player is on ground
		bool grounded = isGrounded();

		// If player is trying to jump
		if (_requestJump && !_isInAir && !_isJumping) {
			// Add jumpForce to y velocity
			velocity.y = jumpForce;
			// Reset _requestJump
			_requestJump = false;
			// Set player jumping
			_isJumping = true;
		}

		// If player is jumping and has left the ground
		if (_isJumping && !grounded)
			// Set his inAir status to true
			_isInAir = true;

		// If player is inAir, check if he is grounded
		if (_isInAir && grounded) {
			// If he is reset _isInAir
			_isInAir = false;
			_isJumping = false;
		}

		// Reset isJumping
		_requestJump = false;

		// Set new velocity to player Rigidbody
		_rigidbody.velocity = velocity;
	}

	void handleAnimator() {

		// Update animator values
		_animator.SetBool("isRunning", _moveInput.x != 0f || _isJumping);

		// if player is running speed up animation speed
		if (_isRunning && _moveInput.x != 0)
			_animator.speed = 1.5f;

		// Stop here if moveInput has not been updated
		if (_moveInput.x == 0f) return;

		// Here we check if the player is is looking right,
		// If the SpriteRenderer flip direction is not like current looking direction,
		// We update flipX SpriteRenderer state
		bool isLookingRight = _moveInput.x < 0;
		if (_spriteRenderer.flipX != isLookingRight)
			_spriteRenderer.flipX = isLookingRight;
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
		_requestJump = true;
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
	 * Used to draw collisions & cast on scene when selected
	 * @memberOf : Debug 🤓
	 */
	void OnDrawGizmosSelected() {
	
		// Set draw color to red
		Gizmos.color = Color.red;
		// Draw groundChecker box
		Gizmos.DrawWireCube(groundCheckerOrigin.position, groundCheckerBoxSize);
	}
}
