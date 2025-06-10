using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LevelExit : MonoBehaviour
{
	private int currentSceneIndex;

	[SerializeField] private int delayInSeconds = 1;

	/*
	 * Start called before the first frame
	 * @memberOf : UnityEngine
	 */
	void Start() {

		// Get current active scene index
		currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
	}

	/*
	 * Is called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
		
	}

	/*
	 * Called when new object is colliding
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerEnter2D(Collider2D other) {

		if (other.gameObject.layer == LayerMask.NameToLayer("Player"))
			// Load scene after waiting delay
			Invoke("LoadScene", delayInSeconds);
	}

	/*
	 * Load Next Level
	 * @memberOf : LevelExit
	 */
	void LoadScene() {
		// Load Next Scene
		SceneManager.LoadScene(currentSceneIndex + 1);
	}
}
