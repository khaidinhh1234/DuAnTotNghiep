const Test = () => {
  return (
    <div className="mt-40">
      <form>
        <img src="..." />
        <div>
          <h3>Basic Tee</h3>
          <h3>$35</h3>
          <fieldset>
            <legend className="sr-only">Choose a color</legend>
            <div className="forced-color-adjust-none ...">
              <label>
                <input
                  className="sr-only"
                  type="radio"
                  name="color-choice"
                  defaultValue="White"
                />
                <span className="sr-only">White</span>
                <span className="size-6 rounded-full border border-black border-opacity-10 bg-white" />
              </label>
              {/* ... */}
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default Test;
