using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

/*
 * TODO:
 * - I Dont like the Jumping system cause we cant hold `JUMP` to make the player keep jumping
 * - Add wall jump feature
 * - Improve jump system
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
	private bool _isClimbing = false;

	// Player movement input
	private Vector2 _moveInput = Vector2.zero;

	// Coyote jump vars
	private float _coyoteTime = 0f;

	// Player main collider
	private CapsuleCollider2D _collider;

	private float _startGrativityScale;

	// Ground check system
	[Header("Colliders checker System")]
	[SerializeField] private BoxCollider2D leftCollider;
	[SerializeField] private BoxCollider2D rightCollider;
	[SerializeField] private BoxCollider2D bottomCollider;

	// Player movement config
	[Header("Movement values")]
	[SerializeField] private float jumpForce = 5f;
	[SerializeField] private float moveSpeed = 5f;
	[SerializeField] private float runSpeed = 8f;
	[SerializeField] private float coyoteDuration = 0.2f;
	[SerializeField] private float climbingSpeed = 3f;

	/*
	 * Start Method used to get Player's Components
	 * @memberOf : UnityEngine
	 */
	void Start() {
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<CapsuleCollider2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();

		// Set startGrativityScale
		_startGrativityScale = _rigidbody.gravityScale;
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

	/*
	 * Handle Player Movements
	 * @memberOf : PlayerMovement
	 */
	private void handleMovements() {

		// Get current Rigidbody velocity
		Vector2 velocity = _rigidbody.velocity;

		// Add velocity is player depening of player input & state
		velocity.x = _moveInput.x * (_isRunning && !_isJumping ? runSpeed : moveSpeed);

		// Get grounded value
		bool grounded = isGrounded();

		// If player is falling, we set him inAir
		if (!grounded && !_isJumping && _coyoteTime < coyoteDuration) {

			// Wait coyoteDuration (deltaTime is in seconds)
			_coyoteTime += Time.deltaTime;

			// If we go out the coyoteDuration we set him in air
			if (_coyoteTime >= coyoteDuration)
				_isInAir = true;
		}
		// Else we reset coyoteTime
		else if (_coyoteTime != 0f)
			_coyoteTime = 0f;

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
		else if (_isInAir && grounded) {
			// If he is reset _isInAir
			_isInAir = false;
			_isJumping = false;
		}

		// Reset isJumping
		_requestJump = false;

		// Handle Climbing
		if (isTouchingLadder()) {

			// Remove Rigidbody gravity
			_rigidbody.gravityScale = 0f;

			// Make player go up and down to the ladder
			velocity.y = climbingSpeed * _moveInput.y;

			// Set not Climbing to false if we are grounded and not moving on the ladder
			if (grounded && _moveInput.y == 0f)
				_isClimbing = false;
			else
				_isClimbing = true;

		// If not touching ladder reset _isClimbing to false
		} else {

			// Reset _isClimbing
			_isClimbing = false;

			// Readd Rigidbody gravity
			_rigidbody.gravityScale = _startGrativityScale;
		}

		// Set new velocity to player Rigidbody
		_rigidbody.velocity = velocity;
	}

	/*
	 * Handle Player Animations
	 * @memberOf : PlayerMovement
	 */
	private void handleAnimator() {

		// Update animator values
		_animator.SetBool("isRunning", (_moveInput.x != 0f || _isJumping) && !_isClimbing);
		_animator.SetBool("isClimbing", _isClimbing);

		// Make Climbing animation stop if we are not moving
		if (_isClimbing && _moveInput.y == 0f)
			_animator.speed = 0f;

		// if player is running speed up animation speed
		else if (_isRunning && _moveInput.x != 0)
			_animator.speed = 1.5f;
		
		// Set to default animation speed
		else
			_animator.speed = 1f;

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
	private void OnMove(InputValue value) {
		_moveInput = value.Get<Vector2>();
	}

	/*
	 * Update request jump status
	 * @memberOf : InputSystem.Event
	 */
	private void OnJump() {
		_requestJump = true;
	}

	/*
	 * Handle player isRunning state
	 * @memberOf : InputSystem.Event
	 */
	private void OnRun(InputValue value) {

		// Get pressing value
		float pressing = value.Get<float>();

		// If Player is pressing is set isRunning to true
		_isRunning = pressing >= 0.5f;
	}
	
	/*
	 * Check if te player is on the ground
	 * @memberOf : PlayerMovement
	 */
	private bool isGrounded() {
		// Check if player bottom collider is colliding with a platform
		return bottomCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}

	/*
	 * Check if te player can wall jump from a left wall
	 * @memberOf : PlayerMovement
	 */
	private bool canWallJumpLeft() {
		// Check if player bottom collider is colliding with a platform
		return leftCollider.IsTouchingLayers(LayerMask.GetMask("Platforms")) && _isInAir;
	}

	/*
	 * Check if te player can wall jump from a right wall
	 * @memberOf : PlayerMovement
	 */
	private bool canWallJumpRight() {
		// Check if player bottom collider is colliding with a platform
		return rightCollider.IsTouchingLayers(LayerMask.GetMask("Platforms")) && _isInAir;
	}


	/*
	 * Check if player is touching a ladder
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingLadder() {
		// Check if player is touching a ladder
		return rightCollider.IsTouchingLayers(LayerMask.GetMask("Climbing"));
	}


	/*
	 * Make player climb the ladder
	 * @memberOf : PlayerMovement
	 */
	private void climb() {

	}
}
