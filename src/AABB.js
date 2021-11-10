export default class AABB {

    minX = Infinity;
    minY = Infinity;
    maxX = -Infinity;
    maxY = -Infinity;

    add(x, y)
    {
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
    }

    get width()
    {
        return (this.maxX - this.minX) | 0;
    }


    get height()
    {
        return (this.maxY - this.minY) | 0;
    }

    static equals(a,b)
    {
        if (!a && !b)
        {
            return true;
        }
        else if (a && !b)
        {
            return false;
        }
        else if (!a && b)
        {
            return false;
        }
        else
        {
            return a.minX === b.minX && a.minY === b.minY && a.maxX === b.maxX && a.maxY === b.maxY;
        }
    }
}
