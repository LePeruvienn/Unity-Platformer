using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using Cinemachine;

/*
 * TODO:
 * - I Dont like the Jumping system cause we cant hold `JUMP` to make the player keep jumping
 * - Add wall jump feature
 * - Improve Ladder System
 * - Add blend transition for camera system !
 * - ...
 */

public class PlayerMovement : MonoBehaviour
{
	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;
	private SpriteRenderer _spriteRenderer;

	// Player death
	private bool _isDead = false;

	// Player States
	private bool _isRunning = false;
	private bool _isJumping = false;
	private bool _isInAir = false;
	private bool _isClimbing = false;

	// Player movement input
	private Vector2 _moveInput = Vector2.zero;

	// Coyote jump vars
	private float _coyoteTime = 0f;

	// Player main collider
	private CapsuleCollider2D _collider;

	// Used to save the base gravity scale
	private float _startGrativityScale;

	// GameSession script
	private GameSession _gameSession;

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

	[Header("Die Animation")]
	[SerializeField] private float deathJumpForce = 6f;
	[SerializeField] private float deathRotateSpeed = 2f;

	[Header("Camera")]
	[SerializeField] private CinemachineStateDrivenCamera stateDrivenCamera;

	[Header("SFX Assets")]
	[SerializeField] private AudioClip deathSFX;


	// Cached vars ☝️🤓 "Used to optimize memory allocation !"
	private Vector3 _cachedDeathRotation = new Vector3 (0, 0, 0);
	
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
		_gameSession = FindObjectOfType<GameSession>();

		// Set startGrativityScale
		_startGrativityScale = _rigidbody.gravityScale;
	}

	/*
	 * Handle Player movement & animator behaviour
	 * @memberOf : UnityEngine
	 */
	void FixedUpdate() {

		// If player is dead handle die animation
		if (_isDead) {
			die();
			return;
		}

		// If we are touching water kill player 
		if (isTouchingWater() || isTouchingSpikes()) {
			kill();
			return;
		}

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

		// Handle Climbing
		if (isTouchingLadder()) {

			// Set not Climbing to false if we are grounded and not moving on the ladder
			if (grounded && _moveInput.y == 0f)
				_isClimbing = false;

			else if (_moveInput.y != 0 && !_isClimbing)
				_isClimbing = true;

			// If player is Climbing
			if (_isClimbing) {
				// Remove Rigidbody gravity
				_rigidbody.gravityScale = 0f;
				// Make player go up and down to the ladder
				velocity.y = climbingSpeed * _moveInput.y;
			}

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
	 * Handle player's JUMP
	 * @memberOf : InputSystem.Event
	 */
	private void OnJump() {

		// Dont handle player's input if he is dead
		if (_isDead) return;

		// If player is trying to jump
		if (!_isInAir && !_isJumping) {

			// Get current Rigidbody velocity
			Vector2 velocity = _rigidbody.velocity;

			// Add jumpForce to y velocity
			velocity.y = jumpForce;

			// Set player jumping
			_isJumping = true;

			// Set Rigidbody2D new velocity
			_rigidbody.velocity = velocity;
		}
	}

	/*
	 * Handle player isRunning state
	 * @memberOf : InputSystem.Event
	 */
	private void OnRun(InputValue value) {

		// Dont handle player's input if he is dead
		if (_isDead) return;

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
	 * Check if player is touching water
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingWater() {
		// Check if player is touching water
		return _collider.IsTouchingLayers(LayerMask.GetMask("Water"));
	}

	/*
	 * Check if player is touching spikes
	 * @memberOf : PlayerMovement
	 */
	private bool isTouchingSpikes() {
		// Check if player is touching water
		return bottomCollider.IsTouchingLayers(LayerMask.GetMask("Spikes"));
	}

	/*
	 * Handle player death movement & animation
	 * @memberOf : PlayerMovement
	 */
	private void die() {

		// Return if player is not falling
		if (_rigidbody.velocity.y > 0) return;

		// Make player rotate over time
		_cachedDeathRotation.z = deathRotateSpeed * Time.deltaTime * 1000;
		transform.Rotate (_cachedDeathRotation);
	}

	/*
	 * Make the player die
	 * @memberOf : PlayerMovement
	 */
	public void kill() {

		// Play death SFX
		AudioSource.PlayClipAtPoint(deathSFX, Camera.main.transform.position);

		// Player death animation
		_animator.SetTrigger("death");

		// Disable collider
		_collider.enabled = false;

		// Make player jump & reset x velocity
		Vector2 velocity = _rigidbody.velocity;
		velocity.y = deathJumpForce;
		velocity.x = 0;
		_rigidbody.velocity = velocity;

		// Disable Camera
		stateDrivenCamera.enabled = false;

		// Set dead status to true
		_isDead = true;
	}
}
