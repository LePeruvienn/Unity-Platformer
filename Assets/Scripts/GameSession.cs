using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

public class GameSession : MonoBehaviour
{

	private GameObject[] _heartObjects;

	private int playerLives;

	private int arrowAmount = 0;

	private float showGameOverTime = 0f;

	private PlayerMovement _playerMovement;

	[Header("Audio SFX")]
	[SerializeField] private AudioClip lifePickupSFX;

	[Header("Player")]
	[SerializeField] private GameObject playerObject;

	[SerializeField] private int maxPlayerLives = 3;
	[SerializeField] private float immuneDuration = 3f;

	[Header("Arrows")]
	[SerializeField] private int startArrowAmount = 3;

	[Header("Hearts")]
	[SerializeField] private Sprite fullHeart;
	[SerializeField] private Sprite emptyHeart;
	[SerializeField] private GameObject healthBarRoot;
	[SerializeField] private GameObject heartPrefab;

	[Header("Score & Arrow UI")]
	[SerializeField] private TMP_Text scoreText;
	[SerializeField] private TMP_Text arrowsText;

	[Header("Game Over Screen")]
	[SerializeField] private float timeToWaitBeforeGameOver = 5f;
	[SerializeField] private GameObject gameOverCanvas;
	[SerializeField] private GameObject playerWinCanvas;

	/*
	 * Called before Start
	 * @memberOf : UnityEngine
	 */
	void Awake() {

		/*

		I wanna make each level reset all game session (lives ect) so i think it is better to let it like this.

		// Get numbers of game session in scene
		int numberOfGameSessions = FindObjectsOfType<GameSession>().Length;

		// If there is already a session destroy this game object
		if(numberOfGameSessions > 1)
			Destroy(gameObject);
		// Else we dont destory it
		else
			DontDestroyOnLoad(gameObject);

		*/
	}

	/*
	 * Start is called before the first frame update
	 * @memberOf : UnityEngine
	 */
	void Start() {

		// Set playerLives
		playerLives = maxPlayerLives;

		// set arrowAmount
		arrowAmount = startArrowAmount;

		// Get player PlayerMovement object from player
		_playerMovement = playerObject.GetComponent<PlayerMovement>();

		// Setup haert objects array
		_heartObjects = new GameObject[playerLives];

		// Intialize healthbar
		initHealthBar();

		// Update score text
		scoreText.SetText("x " + ScoreManager.Instance.getScore());

		// Update arrows text
		arrowsText.SetText("x " + arrowAmount);
	}

	/*
	 * Called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {

		// If we are waiting for game over
		if (showGameOverTime > 0) {
	
			// remove elapsed time
			showGameOverTime -= Time.deltaTime;

			// Set object active !
			if (showGameOverTime < 0)
				gameOverCanvas.SetActive(true);
		}
	}

	/*
	 * Intialize healthbar by creating all hearts
	 * @memberOf : UnityEngine
	 */
	private void initHealthBar() {

		// Check if all is set good
		if (heartPrefab == null) Debug.LogError("heartPrefab not set !!");
		if (healthBarRoot == null) Debug.LogError("healthBarRoot not set !!");

		// Generate hearts objects in UI
		for (int i = 0; i < playerLives; i++) {

			// Instantiate object
			GameObject heartImage = Instantiate(heartPrefab, healthBarRoot.transform.position, healthBarRoot.transform.rotation) as GameObject;

			// Set localScale & position & parent
			heartImage.transform.position = healthBarRoot.transform.position;
			heartImage.transform.localPosition = healthBarRoot.transform.position;
			heartImage.transform.parent = healthBarRoot.transform;
			heartImage.transform.localScale = new Vector3 (1, 1, 1);

			// Set image
			Image image = heartImage.GetComponent<Image>();
			image.sprite = fullHeart;

			// Save object is _heartObjects array
			_heartObjects[i] = heartImage;
		}
	}

	/*
	 * Remove a live from player
	 * @memberOf : GameSession
	 */
	public void takeLife(bool forceDeath = false) {

		// If player has no lives return
		// If player is immmune dont handle takeLife
		// If player is rolling dont takeLife
		if (playerLives == 0 || _playerMovement.isImmune() || _playerMovement.isRolling()) return;

		// Play life pickup SFX
		AudioSource.PlayClipAtPoint(lifePickupSFX, Camera.main.transform.position);

		// Remove one player live
		playerLives--;

		// Set empty heart image
		Image image = _heartObjects[playerLives].GetComponent<Image>();
		image.sprite = emptyHeart;

		// If we want to kill player (force player's death)
		if (forceDeath) {
			// Set empty heart for all sprites
			for (int i = 0; i < playerLives; i++) {
				Image img = _heartObjects[i].GetComponent<Image>();
				img.sprite = emptyHeart;
			}
		}

		// if player still alive
		if (playerLives > 0 && !forceDeath)
			// Set player immune for 3 seconds 👼
			_playerMovement.setImmune(immuneDuration);

		else {

			// Kill player
			_playerMovement.kill();

			// Enable death screen timer
			showGameOverTime = timeToWaitBeforeGameOver;
		}
	}

	/*
	 * Add 1 to the player's score
	 * @memberOf : GameSession
	 */
	public void addScore() {

		// Add 1 to score
		ScoreManager.Instance.addScore();

		// Update score text
		scoreText.SetText("x " + ScoreManager.Instance.getScore());
	}

	/*
	 * Add 1 arrow to the player
	 * @memberOf : GameSession
	 */
	public void addArrow() {

		// Add 1 to arrow amount
		arrowAmount++;

		// Update arrows text
		arrowsText.SetText("x " + arrowAmount);
	}

	/*
	 * Make user try to use an arrow
	 * @return bool - true if he do, false if he cant
	 * @memberOf : GameSession
	 */
	public bool useArrow() {

		// If user cant shoot an arrow return false
		if (arrowAmount == 0) return false;

		// Remove 1 to arrow amount
		arrowAmount--;

		// Update arrows text
		arrowsText.SetText("x " + arrowAmount);

		return true;
	}

	/*
	 * Heal player of one life !
	 * @memberOf : GameSession
	 */
	public void heal() {

		// If player is full health return
		if (playerLives == maxPlayerLives) return;

		// Set full heart image
		Image image = _heartObjects[playerLives].GetComponent<Image>();
		image.sprite = fullHeart;

		// Add a life
		playerLives++;
	}

	/*
	 * Used to handle player death when he is 
	 * @memberOf : GameSession
	 */
	private void processPlayerDeath(bool forceDeath = false) {

		// If player stil have lives left and we dont want to force player death
		if(playerLives > 1 && forceDeath == false)
			// Remove one life
			takeLife();

		// Else reset game session
		else
			resetGameSession();
	}

	/*
	 * Restart current level
	 * @memberOf : GameSession
	 */
	public void resetGameSession() {

		// Reset Scene Persist
		// FindObjectOfType<ScenePersist>().resetScenePersist();

		// Reset Score
		ScoreManager.Instance.reset();

		// Reload Current scene
		SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
	}

	/*
	 * Make the game quit
	 * @memberOf : GameSession
	 */
	public void backToMenu() {

		// Reset Score
		ScoreManager.Instance.reset();

		// Load Menu Scene
		SceneManager.LoadScene(0);
	}

	/*
	 * Make the game quit
	 * @memberOf : GameSession
	 */
	public void quit() {

		// ⚠️ For Debug
		Debug.Log("QUITTING GAME");

		// Quit application
		Application.Quit();
	}
}
