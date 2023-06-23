export class TickManager {
    private tasks = [];
    private intervalHandler;
    private phase = 1;
    private paused = false;

    constructor(private tickDuration) {
        //
    }

    public immediateRestart() {
        this.stop();
        this.run();
        this.phase = 2;
        this.process();

        this.phase = 1;
        this.process();
    }

    public updateTickDuration = (newDuration) => {
        this.tickDuration = newDuration;

        this.stop();
        this.run();
    }

    public isPause = () => this.paused;

    public setPause(state: boolean) {
        this.paused = state;
    }

    public addTask = (task: () => void, phase) => {
        this.tasks.push({ task, phase });
    }

    public run = () => {
        if (!this.intervalHandler) {
            this.intervalHandler = setInterval(this.process, this.tickDuration);
        }
    }

    public stop = () => {
        clearInterval(this.intervalHandler);
        this.intervalHandler = null;
    }

    public dispose = () => {
        this.stop();
        this.tasks.length = 0;
    }

    public clearTasks = () => {
        this.tasks.length = 0;
    }

    public check = () => {
        if (this.tasks.length === 0) {
            this.stop();
        }
        this.run();
    }

    private process = () => {
        if (this.paused) {
            return;
        }

        this.tasks.forEach(task => {
            if (task.phase === this.phase) {
                task.task();
            }
        });

        if (this.phase === 1) {
            this.phase = 2;
        } else {
            this.phase = 1;
        }
    }
}
